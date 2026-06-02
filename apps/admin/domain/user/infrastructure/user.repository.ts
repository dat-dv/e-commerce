import {
  type IApiResponse,
  type ICartResponse,
  type IGetUsersRequest,
  type IGetUsersResponse,
  type IOrderResponse,
  type IPaginatedResult,
  type IUserAvatarResponse,
  type IUserFavoriteProductResponse,
  type IUserProfileResponse,
} from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { type ApiListResponse } from "@/utils/request";
import { apiClient } from "@/utils/request/api-client";

import { AdminUserMapper } from "../../auth/infrastructure/auth.mapper";
import {
  type IAdminCustomerCart,
  type IAdminCustomerFavoriteProduct,
  type IAdminCustomerOrder,
  type IAdminUpdateUserInput,
  type IAdminUser,
  type IAdminUserAvatar,
} from "../types/user.model";
import { type IAdminUserRepository } from "../types/user.repository";
import { AdminCustomerDetailMapper } from "./customer-detail.mapper";

export class AdminUserRepository implements IAdminUserRepository {
  async getUsers(
    params: IGetUsersRequest,
  ): Promise<ApiListResponse<IAdminUser>> {
    const response = await apiClient.get<IApiResponse<IGetUsersResponse>>(
      API_ROUTES.USERS.LIST,
      {
        params,
      },
    );

    return {
      items: (response.data?.items || []).map((item) =>
        AdminUserMapper.toDomain(item),
      ),
      meta: response.data?.meta || {
        total: 0,
        page: params.page ?? 1,
        limit: params.limit ?? 10,
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

  async getUserOrders(
    id: string,
    params: { page?: number; limit?: number } = {},
  ): Promise<ApiListResponse<IAdminCustomerOrder>> {
    const response = await apiClient.get<
      IApiResponse<ApiListResponse<IOrderResponse>>
    >(API_ROUTES.ORDERS.ALL, {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        user_id: id,
      },
    });

    return {
      items: (response.data?.items || []).map((item) =>
        AdminCustomerDetailMapper.orderToDomain(item),
      ),
      meta: response.data?.meta || {
        total: 0,
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        totalPages: 0,
      },
    };
  }

  async getUserCart(id: string): Promise<IAdminCustomerCart> {
    const response = await apiClient.get<IApiResponse<ICartResponse | null>>(
      API_ROUTES.USERS.CART(id),
    );

    return AdminCustomerDetailMapper.cartToDomain(response.data);
  }

  async getUserFavorites(
    id: string,
    params: { page?: number; limit?: number } = {},
  ): Promise<ApiListResponse<IAdminCustomerFavoriteProduct>> {
    const response = await apiClient.get<
      IApiResponse<IPaginatedResult<IUserFavoriteProductResponse>>
    >(API_ROUTES.USERS.FAVORITES(id), {
      params,
    });

    return {
      items: (response.data?.items || []).map((item) =>
        AdminCustomerDetailMapper.favoriteToDomain(item),
      ),
      meta: response.data?.meta || {
        total: 0,
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        totalPages: 0,
      },
    };
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
