import { IOrder } from "./order.types";


export type IOrderResponse = IOrder;

export interface IOrderListResponse {
  items: IOrder[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ICancelOrderResponse {
  success: boolean;
  message?: string;
}
