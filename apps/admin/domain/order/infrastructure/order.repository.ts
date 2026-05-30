import type { IApiResponse, IOrderResponse } from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import type { ApiListResponse } from "@/utils/request";
import { apiClient } from "@/utils/request/api-client";

import type { IAdminOrderRepository } from "../types/order.repository";

export class AdminOrderRepository implements IAdminOrderRepository {
  async getOrders(
    page: number,
    limit: number,
  ): Promise<IApiResponse<ApiListResponse<IOrderResponse>>> {
    const response = await apiClient.get<
      IApiResponse<ApiListResponse<IOrderResponse>>
    >(API_ROUTES.ORDERS.ALL, {
      params: { page, limit },
    });
    return response;
  }
}
