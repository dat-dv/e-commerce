import { EOrderStatus } from "./order.types";


export interface ICreateOrderRequest {
  cartItemIds: string[];
  shippingAddressId?: string;
  promoCode?: string;
}

export interface IGetUserOrdersRequest {
  status?: EOrderStatus[];
  page?: number;
  limit?: number;
}

export interface IUpdateOrderStatusRequest {
  status: EOrderStatus;
}
