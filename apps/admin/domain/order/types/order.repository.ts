import type { EOrderSortBy, ESortValue } from "@ecommerce/shared";

import type { IAdminCustomerOrder } from "@/domain/user/types/user.model";
import type { ApiListResponse } from "@/utils/request";

export interface IAdminOrderGetParams {
  page: number;
  limit: number;
  userId?: string;
  search?: string;
  sort_by?: EOrderSortBy;
  sort_order?: ESortValue;
}

export interface IAdminOrderRepository {
  getOrders(
    params: IAdminOrderGetParams,
  ): Promise<ApiListResponse<IAdminCustomerOrder>>;
}
