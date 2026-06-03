import type { IAdminCustomerOrder } from "@/domain/user/types/user.model";
import type { ApiListResponse } from "@/utils/request";

export interface IAdminOrderGetParams {
  page: number;
  limit: number;
  userId?: string;
  search?: string;
}

export interface IAdminOrderRepository {
  getOrders(
    params: IAdminOrderGetParams,
  ): Promise<ApiListResponse<IAdminCustomerOrder>>;
}
