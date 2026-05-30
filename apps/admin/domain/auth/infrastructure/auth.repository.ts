import { type IAdminUser } from "@/domain/user";
import { apiClient } from "@/utils/request/api-client";
import { type ApiResponse } from "@/utils/request/api-client.types";

import {
  type TAdminForgotPasswordRequest,
  type TAdminSignInRequest,
} from "../types/auth.model";
import { type IAdminAuthRepository } from "../types/auth.repository";

export class AdminAuthRepository implements IAdminAuthRepository {
  async login(request: TAdminSignInRequest): Promise<ApiResponse<IAdminUser>> {
    return apiClient.post<ApiResponse<IAdminUser>>("/auth/login", request);
  }

  async forgotPassword(
    request: TAdminForgotPasswordRequest,
  ): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>("/auth/forgot-password", request);
  }

  async fetchMe(): Promise<ApiResponse<IAdminUser>> {
    return apiClient.get<ApiResponse<IAdminUser>>("/auth/me");
  }
}
