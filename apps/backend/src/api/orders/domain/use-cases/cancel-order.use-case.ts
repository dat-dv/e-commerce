import { Injectable, Inject, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { OrderStatus } from '../entities/order-status.enum';

@Injectable()
export class CancelOrderUseCase {
  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
    private readonly prisma: PrismaService,
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

    if (order.status !== Number(OrderStatus.PENDING)) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. Cập nhật trạng thái đơn hàng
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
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

      return updatedOrder;
    });
  }
}
