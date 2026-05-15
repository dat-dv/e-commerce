import { Order, IPaginatedResult, IGetUserOrdersRequest } from '@ecommerce/shared';

interface ICreateOrderInput {
  user_id: string;
  total_amount: number;
  discount_amount?: number;
  shipping_address_id?: string;
  coupon_id?: string;
  items: { sku_id: string; quantity: number; price: number; flash_sale_id?: string; snapshot?: unknown }[];
}

export interface IOrdersRepository {
  createOrder(data: ICreateOrderInput): Promise<Order>;
  getUserOrders(userId: string, params?: IGetUserOrdersRequest): Promise<IPaginatedResult<Order>>;
  findById(id: string): Promise<Order | null>;
  updateStatus(id: string, status: number): Promise<Order>;
  cancelOrder(id: string, userId: string): Promise<Order>;
}

export const IOrdersRepository = Symbol('IOrdersRepository');
