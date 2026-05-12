import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
  ) {}

  async execute(id: string, userId: string, isAdmin = false) {
    const order = await this.ordersRepository.getOrder(id);
    if (!order) {
      throw new Error('Order not found');
    }
    // Check ownership
    if (!isAdmin && order.user_id !== userId) {
      throw new UnauthorizedException('You are not allowed to view this order');
    }
    return order;
  }
}
