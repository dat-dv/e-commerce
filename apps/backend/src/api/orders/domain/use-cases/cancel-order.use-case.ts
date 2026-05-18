import { Injectable, Inject, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { EOrderStatus } from '@ecommerce/shared';
import { NotificationService } from 'src/api/notifications/notifications.service';
import { ENotificationType } from '@ecommerce/shared';

@Injectable()
export class CancelOrderUseCase {
  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to cancel this order');
    }

    if (order.status !== Number(EOrderStatus.PENDING)) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: EOrderStatus.CANCELLED },
      });

      // 2. Hoàn trả tồn kho
      for (const item of order.items) {
        // Hoàn trả tồn kho SKU
        await tx.sku.update({
          where: { id: item.sku_id },
          data: { stock: { increment: item.quantity } },
        });

        // Hoàn trả tồn kho Flash Sale nếu có
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

      // 3. Hoàn trả lượt sử dụng mã giảm giá nếu có
      if (order.coupon_id) {
        await tx.coupon.update({
          where: { id: order.coupon_id },
          data: { used_count: { decrement: 1 } },
        });
      }

      return updatedOrder;
    });

    await this.notificationService.sendToUser(
      userId,
      'Đơn hàng đã bị hủy',
      `Đơn hàng #${orderId.slice(-6).toUpperCase()} đã được hủy thành công.`,
      ENotificationType.ORDER,
      {
        orderId: orderId,
      },
    );

    return result;
  }
}
