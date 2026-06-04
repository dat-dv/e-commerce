import type {
  EOrderStatus,
  IApiResponse,
  IOrderResponse,
} from "@ecommerce/shared";

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
    const { page, limit, userId, search, sort_by, sort_order } = params;
    const response = await apiClient.get<
      IApiResponse<ApiListResponse<IOrderResponse>>
    >(API_ROUTES.ORDERS.ALL, {
      params: {
        page,
        limit,
        ...(userId ? { user_id: userId } : {}),
        ...(search ? { search } : {}),
        ...(sort_by ? { sort_by } : {}),
        ...(sort_order != null ? { sort_order } : {}),
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

  async getOrder(id: string): Promise<IAdminCustomerOrder> {
    const response = await apiClient.get<IApiResponse<IOrderResponse>>(
      API_ROUTES.ORDERS.DETAIL(id),
    );

    return AdminCustomerDetailMapper.orderToDomain(response.data!);
  }

  async updateStatus(
    id: string,
    status: EOrderStatus,
  ): Promise<IAdminCustomerOrder> {
    const response = await apiClient.put<IApiResponse<IOrderResponse>>(
      API_ROUTES.ORDERS.UPDATE_STATUS(id),
      { status },
    );

    return AdminCustomerDetailMapper.orderToDomain(response.data!);
  }
}
