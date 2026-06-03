import type { IApiResponse, IOrderResponse } from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { AdminCustomerDetailMapper } from "@/domain/user/infrastructure/customer-detail.mapper";
import type { IAdminCustomerOrder } from "@/domain/user/types/user.model";
import type { ApiListResponse } from "@/utils/request";
import { apiClient } from "@/utils/request/api-client";

import type {
  IAdminOrderGetParams,
  IAdminOrderRepository,
} from "../types/order.repository";

export class AdminOrderRepository implements IAdminOrderRepository {
  async getOrders(
    params: IAdminOrderGetParams,
  ): Promise<ApiListResponse<IAdminCustomerOrder>> {
    const { page, limit, userId, search } = params;
    const response = await apiClient.get<
      IApiResponse<ApiListResponse<IOrderResponse>>
    >(API_ROUTES.ORDERS.ALL, {
      params: {
        page,
        limit,
        ...(userId ? { user_id: userId } : {}),
        ...(search ? { search } : {}),
      },
    });

    const items = response.data?.items ?? [];
    const meta = response.data?.meta ?? {
      total: 0,
      page,
      limit,
      totalPages: 0,
    };

    return {
      items: items.map((item) => AdminCustomerDetailMapper.orderToDomain(item)),
      meta,
    };
  }
}
