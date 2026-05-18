import { IOrderResponse, IPaginatedResult } from '@ecommerce/shared';
import { CreateOrderInputDto, GetUserOrdersDto, GetAllOrdersInputDto } from '../../dto/create-order-input.dto';

export interface IOrdersRepository {
  createOrder(data: CreateOrderInputDto): Promise<IOrderResponse>;
  getUserOrders(userId: string, params?: GetUserOrdersDto): Promise<IPaginatedResult<IOrderResponse>>;
  getAllOrders(params?: GetAllOrdersInputDto): Promise<IPaginatedResult<IOrderResponse>>;
  findById(id: string): Promise<IOrderResponse | null>;
  updateStatus(id: string, status: number): Promise<IOrderResponse>;
  cancelOrder(id: string, userId: string): Promise<IOrderResponse>;
}

export const IOrdersRepository = Symbol('IOrdersRepository');
