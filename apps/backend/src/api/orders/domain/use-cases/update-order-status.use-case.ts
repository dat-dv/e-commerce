import { Injectable, Inject, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { OrderStatus } from '../entities/order-status.enum';
import { NotificationService } from 'src/api/notifications/notifications.service';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(id: string, newStatus: number, isAdmin = false) {
    if (!isAdmin) {
      throw new UnauthorizedException('Only admins can update order status');
    }

    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // 1. Kiểm tra trạng thái hiện tại
    if (order.status === Number(OrderStatus.DELIVERED) || order.status === Number(OrderStatus.CANCELLED)) {
      throw new BadRequestException('Cannot update status of a delivered or cancelled order');
    }

    let updatedOrder;

    // 2. Logic hoàn trả hàng nếu chuyển sang CANCELLED hoặc REFUNDED
    if (newStatus === Number(OrderStatus.CANCELLED) || newStatus === Number(OrderStatus.REFUNDED)) {
      updatedOrder = await this.prisma.$transaction(async (tx) => {
        // Cập nhật trạng thái
        const res = await tx.order.update({
          where: { id },
          data: { status: newStatus },
        });

        // Hoàn trả tồn kho
        for (const item of order.items) {
          await tx.sku.update({
            where: { id: item.sku_id },
            data: { stock: { increment: item.quantity } },
          });

          if (item.flash_sale_id) {
            await tx.flashSaleProduct.update({
              where: { id: item.flash_sale_id },
              data: {
                stock: { increment: item.quantity },
                sold_count: { decrement: item.quantity },
              },
            });
          }
        }
        return res;
      });
    } else {
      // 3. Cập nhật trạng thái thông thường
      updatedOrder = await this.ordersRepository.updateStatus(id, newStatus);
    }

    // 4. Gửi thông báo cho khách hàng
    this.sendNotification(order.user_id, newStatus, id);

    return updatedOrder;
  }

  private async sendNotification(userId: string, status: number, orderId: string) {
    let title = 'Cập nhật đơn hàng';
    let body = `Đơn hàng #${orderId.slice(-6)} của bạn đã thay đổi trạng thái.`;

    switch (status) {
      case Number(OrderStatus.CONFIRMED):
        title = 'Đơn hàng đã được xác nhận';
        body = `Đơn hàng #${orderId.slice(-6)} đã được người bán xác nhận.`;
        break;
      case Number(OrderStatus.SHIPPING):
        title = 'Đơn hàng đang được giao';
        body = `Đơn hàng #${orderId.slice(-6)} đang trên đường đến với bạn.`;
        break;
      case Number(OrderStatus.DELIVERED):
        title = 'Giao hàng thành công';
        body = `Đơn hàng #${orderId.slice(-6)} đã được giao thành công. Chúc bạn trải nghiệm sản phẩm vui vẻ!`;
        break;
      case Number(OrderStatus.CANCELLED):
        title = 'Đơn hàng đã bị hủy';
        body = `Đơn hàng #${orderId.slice(-6)} của bạn đã bị hủy.`;
        break;
    }

    await this.notificationService.sendToUser(userId, title, body, {
      orderId: orderId,
      type: 'ORDER_STATUS_CHANGE',
    });
  }
}
