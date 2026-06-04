import { ENotificationType, EOrderStatus, IOrderResponse } from '@ecommerce/shared';
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { NotificationService } from 'src/api/notifications/notifications.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { UpdateOrderStatusDto } from '../../dto/update-order-status.dto';
import { IOrdersRepository } from '../entities/orders.repository.interface';

/** Terminal statuses that block further transitions */
const TERMINAL_STATUSES = [EOrderStatus.DELIVERED, EOrderStatus.CANCELLED, EOrderStatus.RETURNED];

/** Statuses that require stock restoration */
const STOCK_RESTORE_STATUSES = [EOrderStatus.CANCELLED];

@Injectable()
export class UpdateAdminOrderStatusUseCase {
  private readonly logger = new Logger(UpdateAdminOrderStatusUseCase.name);

  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(id: string, dto: UpdateOrderStatusDto): Promise<IOrderResponse> {
    const newStatus = dto.status;
    this.logger.log(
      `Order status update requested: ${JSON.stringify({
        orderId: id,
        newStatus,
      })}`,
    );

    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      this.logger.warn(`Order status update skipped: order not found ${id}`);
      throw new NotFoundException('Order not found');
    }

    if (TERMINAL_STATUSES.includes(order.status)) {
      this.logger.warn(
        `Order status update blocked: ${JSON.stringify({
          orderId: id,
          currentStatus: order.status,
          requestedStatus: newStatus,
        })}`,
      );
      throw new BadRequestException('Cannot update status of a delivered, cancelled, or returned order');
    }

    let updatedOrder: IOrderResponse;

    if (STOCK_RESTORE_STATUSES.includes(newStatus)) {
      updatedOrder = await this.prisma.$transaction(async (tx) => {
        const res = await tx.order.update({
          where: { id },
          data: { status: newStatus },
        });

        const skuUpdates: Prisma.PrismaPromise<unknown>[] = [];
        const flashSaleUpdates: Prisma.PrismaPromise<unknown>[] = [];

        for (const item of order.items) {
          skuUpdates.push(
            tx.sku.update({
              where: { id: item.sku_id },
              data: { stock: { increment: item.quantity } },
            }),
          );

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
        return res;
      });
    } else {
      updatedOrder = await this.ordersRepository.updateStatus(id, newStatus);
    }

    this.logger.log(
      `Order status updated, sending notification: ${JSON.stringify({
        orderId: id,
        userId: order.user_id,
        previousStatus: order.status,
        newStatus,
      })}`,
    );

    await this.sendNotification(order.user_id, newStatus, id);

    this.logger.log(
      `Order notification flow finished: ${JSON.stringify({
        orderId: id,
        userId: order.user_id,
        newStatus,
      })}`,
    );

    return updatedOrder;
  }

  private async sendNotification(userId: string, status: EOrderStatus, orderId: string) {
    const short = orderId.slice(-6).toUpperCase();
    const map: Partial<Record<EOrderStatus, { title: string; body: string }>> = {
      [EOrderStatus.PAID]: {
        title: 'Order confirmed',
        body: `Order #${short} has been confirmed by the seller.`,
      },
      [EOrderStatus.SHIPPING]: {
        title: 'Order shipped',
        body: `Order #${short} is on its way to you.`,
      },
      [EOrderStatus.DELIVERED]: {
        title: 'Order delivered',
        body: `Order #${short} has been delivered. Enjoy your purchase!`,
      },
      [EOrderStatus.CANCELLED]: {
        title: 'Order cancelled',
        body: `Order #${short} has been cancelled.`,
      },
    };

    const notification = map[status] ?? {
      title: 'Order update',
      body: `Order #${short} status has been updated.`,
    };

    this.logger.log(
      `Dispatching order notification: ${JSON.stringify({
        orderId,
        userId,
        status,
        title: notification.title,
      })}`,
    );

    await this.notificationService.sendToUser(userId, notification.title, notification.body, ENotificationType.ORDER, {
      orderId,
      status: status.toString(),
    });
  }
}
