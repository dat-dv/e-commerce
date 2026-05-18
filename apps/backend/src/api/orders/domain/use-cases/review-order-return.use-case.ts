import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { EOrderStatus, EOrderReturnStatus } from '@ecommerce/shared';
import { ReviewOrderReturnDto } from '../../dto/review-order-return.dto';
import { NotificationService } from 'src/api/notifications/notifications.service';
import { ENotificationType } from '@ecommerce/shared';

const ORDER_STATUS_MAP: Partial<Record<EOrderReturnStatus, EOrderStatus>> = {
  [EOrderReturnStatus.APPROVED]: EOrderStatus.RETURNED,
  [EOrderReturnStatus.REJECTED]: EOrderStatus.RETURN_REJECTED,
  [EOrderReturnStatus.CANCELLED]: EOrderStatus.DELIVERED,
};

@Injectable()
export class ReviewOrderReturnUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(returnId: string, dto: ReviewOrderReturnDto) {
    const orderReturn = await this.prisma.orderReturn.findUnique({
      where: { id: returnId },
      include: { order: true },
    });

    if (!orderReturn) {
      throw new NotFoundException('Return request not found');
    }

    if (
      orderReturn.status === Number(EOrderReturnStatus.APPROVED) ||
      orderReturn.status === Number(EOrderReturnStatus.REJECTED) ||
      orderReturn.status === Number(EOrderReturnStatus.CANCELLED)
    ) {
      throw new BadRequestException('This return request has already been finalized');
    }

    const newReturnStatus = dto.status;
    const newOrderStatus = ORDER_STATUS_MAP[newReturnStatus];

    const updatedReturn = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.orderReturn.update({
        where: { id: returnId },
        data: { status: newReturnStatus },
      });

      if (newOrderStatus) {
        await tx.order.update({
          where: { id: orderReturn.order_id },
          data: { status: newOrderStatus },
        });
      }

      return updated;
    });

    const notificationMap: Partial<Record<EOrderReturnStatus, { title: string; body: string }>> = {
      [EOrderReturnStatus.APPROVED]: {
        title: 'Return request approved',
        body: `Your return for order #${orderReturn.order_id.slice(-6).toUpperCase()} has been approved.`,
      },
      [EOrderReturnStatus.REJECTED]: {
        title: 'Return request rejected',
        body: `Your return for order #${orderReturn.order_id.slice(-6).toUpperCase()} was rejected. ${dto.reason ?? ''}`,
      },
      [EOrderReturnStatus.PROCESSING]: {
        title: 'Return in progress',
        body: `Your return for order #${orderReturn.order_id.slice(-6).toUpperCase()} is being processed.`,
      },
    };

    const notification = notificationMap[newReturnStatus];
    if (notification) {
      await this.notificationService.sendToUser(
        orderReturn.order.user_id,
        notification.title,
        notification.body,
        ENotificationType.ORDER,
        { orderId: orderReturn.order_id, returnId },
      );
    }

    return updatedReturn;
  }
}
