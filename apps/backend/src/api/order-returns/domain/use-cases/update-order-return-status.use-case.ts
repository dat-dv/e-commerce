import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ENotificationType, EOrderReturnStatus, IOrderReturnResponse } from '@ecommerce/shared';
import { NotificationService } from 'src/api/notifications/notifications.service';
import { UpdateOrderReturnStatusDto } from '../../dto/update-order-return-status.dto';
import { IOrderReturnsRepository } from '../entities/order-returns.repository.interface';

const FINAL_RETURN_STATUSES = [EOrderReturnStatus.APPROVED, EOrderReturnStatus.REJECTED, EOrderReturnStatus.CANCELLED];

const ALLOWED_STATUS_TRANSITIONS: Partial<Record<EOrderReturnStatus, EOrderReturnStatus[]>> = {
  [EOrderReturnStatus.PENDING]: [EOrderReturnStatus.PROCESSING],
  [EOrderReturnStatus.PROCESSING]: [EOrderReturnStatus.APPROVED, EOrderReturnStatus.REJECTED],
};

@Injectable()
export class UpdateOrderReturnStatusUseCase {
  constructor(
    @Inject(IOrderReturnsRepository)
    private readonly orderReturnsRepository: IOrderReturnsRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(returnId: string, dto: UpdateOrderReturnStatusDto): Promise<IOrderReturnResponse> {
    const orderReturn = await this.orderReturnsRepository.findById(returnId);

    if (!orderReturn) {
      throw new NotFoundException('Return request not found');
    }

    if (FINAL_RETURN_STATUSES.includes(orderReturn.status)) {
      throw new BadRequestException('This return request has already been finalized');
    }

    this.validateStatusTransition(orderReturn.status, dto.status);

    const updatedReturn = await this.orderReturnsRepository.updateStatus(returnId, orderReturn.order_id, dto);
    const notification = this.getNotification(dto, orderReturn.order_id);

    if (notification && orderReturn.order) {
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

  private validateStatusTransition(currentStatus: EOrderReturnStatus, nextStatus: EOrderReturnStatus): void {
    const allowedNextStatuses = ALLOWED_STATUS_TRANSITIONS[currentStatus] ?? [];

    if (!allowedNextStatuses.includes(nextStatus)) {
      throw new BadRequestException(
        `Invalid return status transition from ${currentStatus} to ${nextStatus}. Return requests must move from PENDING to PROCESSING, then from PROCESSING to APPROVED or REJECTED.`,
      );
    }
  }

  private getNotification(dto: UpdateOrderReturnStatusDto, orderId: string): { title: string; body: string } | null {
    const shortOrderId = orderId.slice(-6).toUpperCase();
    const map: Partial<Record<EOrderReturnStatus, { title: string; body: string }>> = {
      [EOrderReturnStatus.APPROVED]: {
        title: 'Return request approved',
        body: `Your return for order #${shortOrderId} has been approved.`,
      },
      [EOrderReturnStatus.REJECTED]: {
        title: 'Return request rejected',
        body: `Your return for order #${shortOrderId} was rejected. ${dto.reason ?? ''}`,
      },
      [EOrderReturnStatus.PROCESSING]: {
        title: 'Return in progress',
        body: `Your return for order #${shortOrderId} is being processed.`,
      },
    };

    return map[dto.status] ?? null;
  }
}
