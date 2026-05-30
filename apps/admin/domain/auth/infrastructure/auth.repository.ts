import { type IApiResponse, type IUserResponse } from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { type IAdminUser } from "@/domain/user";
import { apiClient } from "@/utils/request/api-client";

import {
  type TAdminForgotPasswordRequest,
  type TAdminSignInRequest,
} from "../types/auth.model";
import { type IAdminAuthRepository } from "../types/auth.repository";
import { AdminUserMapper } from "./auth.mapper";

export class AdminAuthRepository implements IAdminAuthRepository {
  async login(request: TAdminSignInRequest): Promise<IApiResponse<IAdminUser>> {
    const response = await apiClient.post<IApiResponse<IUserResponse>>(
      API_ROUTES.AUTH.LOGIN,
      request,
    );
    return {
      ...response,
      data: AdminUserMapper.toDomain(response.data),
    };
  }

  async forgotPassword(
    request: TAdminForgotPasswordRequest,
  ): Promise<IApiResponse<void>> {
    return apiClient.post<IApiResponse<void>>(
      API_ROUTES.AUTH.FORGOT_PASSWORD,
      request,
    );
  }

  async fetchMe(): Promise<IApiResponse<IAdminUser>> {
    const response = await apiClient.get<IApiResponse<IUserResponse>>(
      API_ROUTES.AUTH.ME,
    );
    return {
      ...response,
      data: AdminUserMapper.toDomain(response.data),
    };
  }

  async logout(): Promise<IApiResponse<void>> {
    return apiClient.post<IApiResponse<void>>(API_ROUTES.AUTH.LOGOUT, {});
  }
}
