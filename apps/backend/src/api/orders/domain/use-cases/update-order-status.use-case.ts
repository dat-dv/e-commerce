import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
  ) {}

  async execute(id: string, status: number, isAdmin = false) {
    if (!isAdmin) {
      throw new UnauthorizedException('Only admins can update order status');
    }
    return this.ordersRepository.updateStatus(id, status);
  }
}
