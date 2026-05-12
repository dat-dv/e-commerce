import { Injectable, Inject } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';

@Injectable()
export class GetUserOrdersUseCase {
  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
  ) {}

  async execute(userId: string) {
    return this.ordersRepository.getUserOrders(userId);
  }
}
