import { Injectable, Inject } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';
import { GetOrdersDto } from '../../dto/get-orders.dto';

@Injectable()
export class GetUserOrdersUseCase {
  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
  ) {}

  async execute(userId: string, dto: GetOrdersDto) {
    let statusArr: number[] | undefined = undefined;
    if (dto.status) {
      statusArr = dto.status.split(',').map((s) => parseInt(s, 10));
    }

    return this.ordersRepository.getUserOrders(userId, {
      status: statusArr,
      page: dto.page,
      limit: dto.limit,
    });
  }
}
