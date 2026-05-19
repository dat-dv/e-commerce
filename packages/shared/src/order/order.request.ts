import { EOrderSortBy, EOrderStatus, EOrderReturnStatus } from "./order.types";
import { ESortValue } from "../common";

export interface ICreateOrderRequest {
  cartItemIds: string[];
  shippingAddressId?: string;
  promoCode?: string;
}

export interface IGetOrderByUserRequest {
  status?: EOrderStatus[];
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

export interface ICreateOrderReturnRequest {
  title: string;
  description?: string;
  image_ids?: string[];
}

export interface IGetOrderReturnsRequest {
  page?: number;
  limit?: number;
  status?: EOrderReturnStatus;
}

export interface IUpdateOrderReturnStatusRequest {
  status: EOrderReturnStatus;
  reason?: string;
  note?: string;
}
