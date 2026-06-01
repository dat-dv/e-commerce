import type {
  IApiResponse,
  IGetOrdersByAdminRequest,
  IOrderResponse,
} from "@ecommerce/shared";

import type { ApiListResponse } from "@/utils/request";

export interface IAdminOrderRepository {
  getOrders(
    page: number,
    limit: number,
    params?: Pick<IGetOrdersByAdminRequest, "user_id">,
    search?: string,
  ): Promise<IApiResponse<ApiListResponse<IOrderResponse>>>;
}
