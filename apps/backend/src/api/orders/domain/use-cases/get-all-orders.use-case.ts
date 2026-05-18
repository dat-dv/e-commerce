import { Injectable, Inject } from '@nestjs/common';
import { IOrdersRepository } from '../entities/orders.repository.interface';
import { GetOrdersByAdminDto } from '../../dto/get-all-orders.dto';

@Injectable()
export class GetAllOrdersUseCase {
  constructor(
    @Inject(IOrdersRepository)
    private readonly ordersRepository: IOrdersRepository,
  ) {}

  async execute(dto: GetOrdersByAdminDto) {
    return this.ordersRepository.getAllOrders({
      status: dto.status,
      page: dto.page,
      limit: dto.limit,
      search: dto.search,
      sort_by: dto.sort_by,
      sort_order: dto.sort_order,
      user_id: dto.user_id,
    });
  }
}
