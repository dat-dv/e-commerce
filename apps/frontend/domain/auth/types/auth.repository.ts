import { ApiResponse } from "@/utils/request/request.types";

import {
  TAuthRequest,
  TRegisterRequest,
  TUser,
  TResetPasswordRequest,
  TForgotPasswordRequest,
  TChangePasswordRequest,
  TUpdateProfileRequest,
} from "./auth.model";

// ===== IRepository =====
export interface IAuthRepository {
  login(request: TAuthRequest): Promise<ApiResponse<TUser>>;
  register(request: TRegisterRequest): Promise<ApiResponse<null>>;
  fetchMe(): Promise<ApiResponse<TUser>>;
  updateProfile(user: TUpdateProfileRequest): Promise<ApiResponse<TUser>>;
  logout(): Promise<ApiResponse<void>>;
  forgotPassword(request: TForgotPasswordRequest): Promise<ApiResponse<void>>;
  resetPassword(request: TResetPasswordRequest): Promise<ApiResponse<void>>;
  changePassword(
    request: TChangePasswordRequest,
  ): Promise<ApiResponse<{ success: boolean }>>;
}
