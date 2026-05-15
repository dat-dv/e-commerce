import { API_ROUTES } from "@/constants/routes";
import {
  ApiResponse,
  IPaginationMeta,
  TRequest,
} from "@/utils/request/request.types";
import { IOrder } from "../types/order.model";
import { IOrderDTO, OrderMapper } from "./order.mapper";

export interface IPlaceOrderParams {
  cartItemIds: string[];
  shippingAddressId?: string;
  promoCode?: string;
}

export interface IOrdersRepository {
  placeOrder(params: IPlaceOrderParams): Promise<ApiResponse<IOrder>>;
  getOrders(params?: {
    status?: number[];
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<IOrder[]>>;
  getOrderDetail(id: string): Promise<ApiResponse<IOrder>>;
  cancelOrder(id: string): Promise<ApiResponse<IOrder>>;
}

export class OrdersRepository implements IOrdersRepository {
  constructor(private request: TRequest) {}

  async placeOrder(params: IPlaceOrderParams): Promise<ApiResponse<IOrder>> {
    const response = await this.request.post<IOrderDTO>(
      API_ROUTES.ORDERS.BASE,
      params,
    );

    return {
      ...response,
      data: response.data ? OrderMapper.toDomain(response.data) : undefined,
    } as ApiResponse<IOrder>;
  }

  async getOrders(params?: {
    status?: number[];
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<IOrder[]>> {
    const response = await this.request.get<{
      items: IOrderDTO[];
      meta: IPaginationMeta;
    }>(API_ROUTES.ORDERS.MINE, { params });

    return {
      ...response,
      data: response.data?.items?.map(OrderMapper.toDomain) || [],
      meta: response.data?.meta,
    } as ApiResponse<IOrder[]>;
  }

  async getOrderDetail(id: string): Promise<ApiResponse<IOrder>> {
    const response = await this.request.get<IOrderDTO>(
      API_ROUTES.ORDERS.DETAIL(id),
    );

    return {
      ...response,
      data: response.data ? OrderMapper.toDomain(response.data) : undefined,
    } as ApiResponse<IOrder>;
  }

  async cancelOrder(id: string): Promise<ApiResponse<IOrder>> {
    const response = await this.request.post<IOrderDTO>(
      API_ROUTES.ORDERS.CANCEL(id),
      {},
    );

    return {
      ...response,
      data: response.data ? OrderMapper.toDomain(response.data) : undefined,
    } as ApiResponse<IOrder>;
  }
}
