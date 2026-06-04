import { ENotificationType, EOrderStatus } from '@ecommerce/shared';
import { BadRequestException, ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { NotificationService } from 'src/api/notifications/notifications.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { IOrdersRepository } from '../entities/orders.repository.interface';

@Injectable()
export class CancelOrderUseCase {
  private readonly logger = new Logger(CancelOrderUseCase.name);

  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(orderId: string, userId: string) {
    const result = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.user_id !== userId) {
        throw new ForbiddenException('You do not have permission to cancel this order');
      }

      const cancelledOrder = await tx.order.updateMany({
        where: {
          id: orderId,
          user_id: userId,
          status: EOrderStatus.PENDING,
        },
        data: { status: EOrderStatus.CANCELLED },
      });

      if (cancelledOrder.count !== 1) {
        throw new BadRequestException('Only pending orders can be cancelled');
      }

      // 2. Hoàn trả tồn kho
      const skuUpdates: Prisma.PrismaPromise<unknown>[] = [];
      const flashSaleUpdates: Prisma.PrismaPromise<unknown>[] = [];

      for (const item of order.items) {
        // Hoàn trả tồn kho SKU
        skuUpdates.push(
          tx.sku.update({
            where: { id: item.sku_id },
            data: { stock: { increment: item.quantity } },
          }),
        );

        // Hoàn trả tồn kho Flash Sale nếu có
        if (item.flash_sale_id) {
          flashSaleUpdates.push(
            tx.flashSaleProduct.update({
              where: { id: item.flash_sale_id },
              data: {
                stock: { increment: item.quantity },
                sold_count: { decrement: item.quantity },
              },
            }),
          );
        }
      }

      await Promise.all(skuUpdates.concat(flashSaleUpdates));

      // 3. Hoàn trả lượt sử dụng mã giảm giá nếu có
      if (order.coupon_id) {
        await tx.coupon.update({
          where: { id: order.coupon_id },
          data: { used_count: { decrement: 1 } },
        });
      }

      return tx.order.findUniqueOrThrow({
        where: { id: orderId },
        include: { items: true },
      });
    });

    try {
      await this.notificationService.sendToUser(
        userId,
        'Đơn hàng đã bị hủy',
        `Đơn hàng #${orderId.slice(-6).toUpperCase()} đã được hủy thành công.`,
        ENotificationType.ORDER,
        {
          orderId: orderId,
        },
      );
    } catch (error) {
      this.logger.error(
        `Failed to send order cancellation notification for order ${orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }

    return result;
  }
}
