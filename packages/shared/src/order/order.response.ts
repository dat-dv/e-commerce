import type { Order, OrderItem, ShippingAddress } from "../generate/browser";
import type { IPaginatedResult } from "../paginate";

export interface IOrderItemResponse extends OrderItem {
  // item_snapshot contains the JSON data of the product at order time
  // already defined as IOrderItemSnapshot in order.types.ts
}

export interface IOrderResponse extends Order {
  items?: IOrderItemResponse[];
  shipping_address?: ShippingAddress | null;
  user?: {
    id: string;
    email: string;
    first_name?: string | null;
    last_name?: string | null;
  } | null;
}

export type IOrderListResponse = IPaginatedResult<IOrderResponse>;

export interface ICancelOrderResponse {
  success: boolean;
  message?: string;
}
