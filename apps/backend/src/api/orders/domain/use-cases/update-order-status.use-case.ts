import { Injectable, Inject, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { OrderStatus } from '../entities/order-status.enum';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
    private readonly prisma: PrismaService,
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

    // 2. Logic hoàn trả hàng nếu chuyển sang CANCELLED hoặc REFUNDED
    if (newStatus === Number(OrderStatus.CANCELLED) || newStatus === Number(OrderStatus.REFUNDED)) {
      return await this.prisma.$transaction(async (tx) => {
        // Cập nhật trạng thái
        const updatedOrder = await tx.order.update({
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
        return updatedOrder;
      });
    }

    // 3. Cập nhật trạng thái thông thường
    return this.ordersRepository.updateStatus(id, newStatus);
  }
}
