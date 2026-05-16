import { API_ROUTES } from "@/constants/routes";
import {
  ApiResponse,
  IPaginationMeta,
  TRequest,
} from "@/utils/request/request.types";
import { TOrder } from "../types/order.model";
import { OrderMapper } from "./order.mapper";
import { IOrderResponse, IOrderListResponse } from "@ecommerce/shared";

export interface TPlaceOrderInput {
  cartItemIds: string[];
  shippingAddressId?: string;
  promoCode?: string;
}

export interface IOrdersRepository {
  placeOrder(params: TPlaceOrderInput): Promise<ApiResponse<TOrder>>;
  getOrders(params?: {
    status?: number[];
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<TOrder[]>>;
  getOrderDetail(id: string): Promise<ApiResponse<TOrder>>;
  cancelOrder(id: string): Promise<ApiResponse<TOrder>>;
}

export class OrdersRepository implements IOrdersRepository {
  constructor(private request: TRequest) {}

  async placeOrder(params: TPlaceOrderInput): Promise<ApiResponse<TOrder>> {
    const response = await this.request.post<IOrderResponse>(
      API_ROUTES.ORDERS.BASE,
      params,
    );

    return {
      ...response,
      data: response.data ? OrderMapper.toDomain(response.data) : undefined,
    } as ApiResponse<TOrder>;
  }

  async getOrders(params?: {
    status?: number[];
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<TOrder[]>> {
    const response = await this.request.get<IOrderListResponse>(
      API_ROUTES.ORDERS.MINE,
      { params },
    );

    return {
      ...response,
      data: response.data?.items?.map(OrderMapper.toDomain) || [],
      meta: response.data?.meta,
    } as ApiResponse<TOrder[]>;
  }

  async getOrderDetail(id: string): Promise<ApiResponse<TOrder>> {
    const response = await this.request.get<IOrderResponse>(
      API_ROUTES.ORDERS.DETAIL(id),
    );

    return {
      ...response,
      data: response.data ? OrderMapper.toDomain(response.data) : undefined,
    } as ApiResponse<TOrder>;
  }

  async cancelOrder(id: string): Promise<ApiResponse<TOrder>> {
    const response = await this.request.post<IOrderResponse>(
      API_ROUTES.ORDERS.CANCEL(id),
      {},
    );

    return {
      ...response,
      data: response.data ? OrderMapper.toDomain(response.data) : undefined,
    } as ApiResponse<TOrder>;
  }
}
