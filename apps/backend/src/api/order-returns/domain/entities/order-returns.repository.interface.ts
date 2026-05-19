import type { IOrderReturnListResponse, IOrderReturnResponse } from '@ecommerce/shared';
import type { Order } from 'generated/prisma/client';
import type { CreateOrderReturnDto } from '../../dto/create-order-return.dto';
import type { GetOrderReturnsDto } from '../../dto/get-order-returns.dto';
import type { UpdateOrderReturnStatusDto } from '../../dto/update-order-return-status.dto';

export interface IOrderReturnsRepository {
  findOrderById(orderId: string): Promise<Order | null>;
  findByOrderId(orderId: string): Promise<IOrderReturnResponse | null>;
  findById(returnId: string): Promise<IOrderReturnResponse | null>;
  create(orderId: string, userId: string, data: CreateOrderReturnDto): Promise<IOrderReturnResponse>;
  findAll(params: GetOrderReturnsDto): Promise<IOrderReturnListResponse>;
  updateStatus(returnId: string, orderId: string, data: UpdateOrderReturnStatusDto): Promise<IOrderReturnResponse>;
  cancel(returnId: string, orderId: string): Promise<IOrderReturnResponse>;
}

export const IOrderReturnsRepository = Symbol('IOrderReturnsRepository');
