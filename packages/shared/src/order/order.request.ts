import { EOrderSortBy, EOrderStatus } from "./order.types";
import { ESortValue } from "../common";

export interface ICreateOrderRequest {
  cartItemIds: string[];
  shippingAddressId?: string;
  promoCode?: string;
}

export interface IGetOrderByUserRequest {
  status?: number[];
  page?: number;
  limit?: number;
}

export interface IGetOrdersByAdminRequest {
  status?: EOrderStatus[];
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: EOrderSortBy;
  sort_order?: ESortValue;
  user_id?: string;
}
