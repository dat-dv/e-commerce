import { IOrder, IOrderItem, ICreateOrderInput } from '@ecommerce/shared';

export interface IOrdersRepository {
  createOrder(data: ICreateOrderInput): Promise<IOrder>;
  getUserOrders(userId: string): Promise<IOrder[]>;
  updateStatus(id: string, status: number): Promise<IOrder>;
  cancelOrder(id: string, userId: string): Promise<IOrder>;
}

export const IOrdersRepository = Symbol('IOrdersRepository');
