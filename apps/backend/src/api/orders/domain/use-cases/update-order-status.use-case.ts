import { ENotificationType, EOrderStatus, IOrderResponse } from '@ecommerce/shared';
import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { NotificationService } from 'src/api/notifications/notifications.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { UpdateOrderStatusDto } from '../../dto/update-order-status.dto';
import { IOrdersRepository } from '../entities/orders.repository.interface';

/** Terminal statuses that block further transitions */
const TERMINAL_STATUSES = [EOrderStatus.DELIVERED, EOrderStatus.CANCELLED, EOrderStatus.RETURNED];

/** Statuses that require stock restoration */
const STOCK_RESTORE_STATUSES = [EOrderStatus.CANCELLED];

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(id: string, dto: UpdateOrderStatusDto, isAdmin = false): Promise<IOrderResponse> {
    const newStatus = dto.status;
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

    if (TERMINAL_STATUSES.includes(order.status)) {
      throw new BadRequestException('Cannot update status of a delivered, cancelled, or returned order');
    }

    let updatedOrder: IOrderResponse;

    if (STOCK_RESTORE_STATUSES.includes(newStatus)) {
      updatedOrder = await this.prisma.$transaction(async (tx) => {
        const res = await tx.order.update({
          where: { id },
          data: { status: newStatus },
        });

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
      updatedOrder = await this.ordersRepository.updateStatus(id, newStatus);
    }

    await this.sendNotification(order.user_id, newStatus, id);

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

    await this.notificationService.sendToUser(userId, notification.title, notification.body, ENotificationType.ORDER, {
      orderId,
      status: status.toString(),
    });
  }
}
