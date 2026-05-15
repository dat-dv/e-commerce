import { Order, IPaginatedResult } from "../index";

export type IOrderResponse = Order;

export type IOrderListResponse = IPaginatedResult<Order>;

export interface ICancelOrderResponse {
  success: boolean;
  message?: string;
}
