import { type IApiResponse, type IGetUsersResponse } from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { type ApiListResponse } from "@/utils/request";
import { apiClient } from "@/utils/request/api-client";

import { AdminUserMapper } from "../../auth/infrastructure/auth.mapper";
import { type IAdminUser } from "../types/user.model";
import { type IAdminUserRepository } from "../types/user.repository";

/**
 * @description Axios-based implementation of IAdminUserRepository
 */
export class AdminUserRepository implements IAdminUserRepository {
  async getUsers(page = 1, limit = 10): Promise<ApiListResponse<IAdminUser>> {
    const response = await apiClient.get<IApiResponse<IGetUsersResponse>>(
      API_ROUTES.USERS.LIST,
      {
        params: { page, limit },
      },
    );

    return {
      items: (response.data?.items || []).map((item) =>
        AdminUserMapper.toDomain(item),
      ),
      meta: response.data?.meta || {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    };
  }

  async deleteUser(id: string): Promise<IApiResponse<boolean>> {
    return apiClient.delete<IApiResponse<boolean>>(API_ROUTES.USERS.DELETE(id));
  }
}
