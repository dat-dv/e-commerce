import { IOrderResponse, IPaginatedResult, IGetUserOrdersRequest } from '@ecommerce/shared';

interface ICreateOrderInput {
  user_id: string;
  total_amount: number;
  discount_amount?: number;
  shipping_address_id?: string;
  coupon_id?: string;
  items: { sku_id: string; quantity: number; price: number; flash_sale_id?: string; snapshot?: unknown }[];
}

export interface IOrdersRepository {
  createOrder(data: ICreateOrderInput): Promise<IOrderResponse>;
  getUserOrders(userId: string, params?: IGetUserOrdersRequest): Promise<IPaginatedResult<IOrderResponse>>;
  findById(id: string): Promise<IOrderResponse | null>;
  updateStatus(id: string, status: number): Promise<IOrderResponse>;
  cancelOrder(id: string, userId: string): Promise<IOrderResponse>;
}

export const IOrdersRepository = Symbol('IOrdersRepository');
