import { Inject, Injectable } from '@nestjs/common';
import { IOrderReturnListResponse } from '@ecommerce/shared';
import { GetOrderReturnsDto } from '../../dto/get-order-returns.dto';
import { IOrderReturnsRepository } from '../entities/order-returns.repository.interface';

@Injectable()
export class GetOrderReturnsUseCase {
  constructor(
    @Inject(IOrderReturnsRepository)
    private readonly orderReturnsRepository: IOrderReturnsRepository,
  ) {}

  async execute(dto: GetOrderReturnsDto): Promise<IOrderReturnListResponse> {
    return this.orderReturnsRepository.findAll(dto);
  }
}
