import {
  type IApiResponse,
  type IGetUsersResponse,
  type IUserAvatarResponse,
  type IUserProfileResponse,
} from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { type ApiListResponse } from "@/utils/request";
import { apiClient } from "@/utils/request/api-client";

import { AdminUserMapper } from "../../auth/infrastructure/auth.mapper";
import {
  type IAdminUpdateUserInput,
  type IAdminUser,
  type IAdminUserAvatar,
} from "../types/user.model";
import { type IAdminUserRepository } from "../types/user.repository";

export class AdminUserRepository implements IAdminUserRepository {
  async getUsers(
    page = 1,
    limit = 10,
    search?: string,
    roleId?: string,
    gender?: string,
    sortBy?: string,
  ): Promise<ApiListResponse<IAdminUser>> {
    const response = await apiClient.get<IApiResponse<IGetUsersResponse>>(
      API_ROUTES.USERS.LIST,
      {
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
          ...(roleId ? { roleId } : {}),
          ...(gender ? { gender } : {}),
          ...(sortBy ? { sortBy } : {}),
        },
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

  async getUser(id: string): Promise<IAdminUser> {
    const response = await apiClient.get<IApiResponse<IUserProfileResponse>>(
      API_ROUTES.USERS.DETAIL(id),
    );

    return AdminUserMapper.toDomain(response.data);
  }

  async getUserAvatars(id: string): Promise<IAdminUserAvatar[]> {
    const response = await apiClient.get<IApiResponse<IUserAvatarResponse[]>>(
      API_ROUTES.USERS.AVATARS(id),
    );

    return (response.data || []).map((avatar) =>
      AdminUserMapper.avatarToDomain(avatar),
    );
  }

  async updateUser(
    id: string,
    data: IAdminUpdateUserInput,
  ): Promise<IAdminUser> {
    const response = await apiClient.patch<IApiResponse<IUserProfileResponse>>(
      API_ROUTES.USERS.UPDATE(id),
      AdminUserMapper.toUpdateDto(data),
    );

    return AdminUserMapper.toDomain(response.data);
  }

  async deleteUser(id: string): Promise<IApiResponse<boolean>> {
    return apiClient.delete<IApiResponse<boolean>>(API_ROUTES.USERS.DELETE(id));
  }
}
