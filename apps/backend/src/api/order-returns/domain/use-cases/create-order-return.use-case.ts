import { Inject, Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ENotificationType, EOrderStatus, IOrderReturnResponse } from '@ecommerce/shared';
import { NotificationService } from 'src/api/notifications/notifications.service';
import { CreateOrderReturnDto } from '../../dto/create-order-return.dto';
import { IOrderReturnsRepository } from '../entities/order-returns.repository.interface';

@Injectable()
export class CreateOrderReturnUseCase {
  constructor(
    @Inject(IOrderReturnsRepository)
    private readonly orderReturnsRepository: IOrderReturnsRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(orderId: string, userId: string, dto: CreateOrderReturnDto): Promise<IOrderReturnResponse> {
    const order = await this.orderReturnsRepository.findOrderById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to request a return on this order');
    }

    if (order.status !== Number(EOrderStatus.DELIVERED)) {
      throw new BadRequestException('Return requests are only allowed for delivered orders');
    }

    const existing = await this.orderReturnsRepository.findByOrderId(orderId);
    if (existing) {
      throw new BadRequestException('A return request already exists for this order');
    }

    const orderReturn = await this.orderReturnsRepository.create(orderId, userId, dto);

    await this.notificationService.sendToUser(
      userId,
      'Return request submitted',
      `Your return request for order #${orderId.slice(-6).toUpperCase()} is under review.`,
      ENotificationType.ORDER,
      { orderId, returnId: orderReturn.id },
    );

    return orderReturn;
  }
}
