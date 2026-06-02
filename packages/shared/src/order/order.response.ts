import type { Image, Order, OrderItem, OrderReturn, OrderReturnImage, ShippingAddress } from "../generate/browser";
import type { IPaginatedResult } from "../paginate";
import type { ISkuResponse } from "../product";

export interface IOrderItemResponse extends OrderItem {
  // item_snapshot contains the JSON data of the product at order time
  // already defined as IOrderItemSnapshot in order.types.ts
  sku?: ISkuResponse;
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

export interface IOrderReturnImageResponse extends OrderReturnImage {
  image?: Image | null;
}

export interface IOrderReturnUserResponse {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
}

export interface IOrderReturnOrderResponse extends Order {
  user?: IOrderReturnUserResponse | null;
}

export interface IOrderReturnResponse extends OrderReturn {
  images?: IOrderReturnImageResponse[];
  order?: IOrderReturnOrderResponse | null;
  created_by?: IOrderReturnUserResponse | null;
}

export type IOrderReturnListResponse = IPaginatedResult<IOrderReturnResponse>;
