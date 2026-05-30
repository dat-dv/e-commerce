import type { IApiResponse, IOrderResponse } from "@ecommerce/shared";

import type { ApiListResponse } from "@/utils/request";

export interface IAdminOrderRepository {
  getOrders(
    page: number,
    limit: number,
  ): Promise<IApiResponse<ApiListResponse<IOrderResponse>>>;
}
