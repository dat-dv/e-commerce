import type {
  IApiResponse,
  IGetOrdersByAdminRequest,
  IOrderResponse,
} from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import type { ApiListResponse } from "@/utils/request";
import { apiClient } from "@/utils/request/api-client";

import type { IAdminOrderRepository } from "../types/order.repository";

export class AdminOrderRepository implements IAdminOrderRepository {
  async getOrders(
    page: number,
    limit: number,
    params?: Pick<IGetOrdersByAdminRequest, "user_id">,
    search?: string,
  ): Promise<IApiResponse<ApiListResponse<IOrderResponse>>> {
    const response = await apiClient.get<
      IApiResponse<ApiListResponse<IOrderResponse>>
    >(API_ROUTES.ORDERS.ALL, {
      params: { page, limit, ...params, ...(search ? { search } : {}) },
    });
    return response;
  }
}
