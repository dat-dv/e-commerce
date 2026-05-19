import { Inject, Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ENotificationType, EOrderReturnStatus, IOrderReturnResponse } from '@ecommerce/shared';
import { NotificationService } from 'src/api/notifications/notifications.service';
import { IOrderReturnsRepository } from '../entities/order-returns.repository.interface';

@Injectable()
export class CancelOrderReturnUseCase {
  constructor(
    @Inject(IOrderReturnsRepository)
    private readonly orderReturnsRepository: IOrderReturnsRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(returnId: string, userId: string): Promise<IOrderReturnResponse> {
    const orderReturn = await this.orderReturnsRepository.findById(returnId);

    if (!orderReturn) {
      throw new NotFoundException('Return request not found');
    }

    if (orderReturn.created_by_id !== userId) {
      throw new ForbiddenException('You do not have permission to cancel this return request');
    }

    if (orderReturn.status !== Number(EOrderReturnStatus.PENDING)) {
      throw new BadRequestException('Only pending return requests can be cancelled');
    }

    const updatedReturn = await this.orderReturnsRepository.cancel(returnId, orderReturn.order_id);

    await this.notificationService.sendToUser(
      userId,
      'Return request cancelled',
      `Your return request for order #${orderReturn.order_id.slice(-6).toUpperCase()} has been cancelled.`,
      ENotificationType.ORDER,
      { orderId: orderReturn.order_id, returnId },
    );

    return updatedReturn;
  }
}
