import { type IUserResponse } from "@ecommerce/shared";

import { type IAdminUser } from "@/domain/user";
import { apiClient } from "@/utils/request/api-client";
import { type ApiResponse } from "@/utils/request/api-client.types";

import {
  type TAdminForgotPasswordRequest,
  type TAdminSignInRequest,
} from "../types/auth.model";
import { type IAdminAuthRepository } from "../types/auth.repository";
import { AdminUserMapper } from "./auth.mapper";

export class AdminAuthRepository implements IAdminAuthRepository {
  async login(request: TAdminSignInRequest): Promise<ApiResponse<IAdminUser>> {
    const response = await apiClient.post<ApiResponse<IUserResponse>>(
      "/auth/login",
      request,
    );
    return {
      ...response,
      data: AdminUserMapper.toDomain(response.data),
    };
  }

  async forgotPassword(
    request: TAdminForgotPasswordRequest,
  ): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>("/auth/forgot-password", request);
  }

  async fetchMe(): Promise<ApiResponse<IAdminUser>> {
    const response =
      await apiClient.get<ApiResponse<IUserResponse>>("/auth/me");
    return {
      ...response,
      data: AdminUserMapper.toDomain(response.data),
    };
  }
}
