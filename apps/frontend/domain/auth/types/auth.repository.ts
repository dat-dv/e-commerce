import { ApiResponse } from "@/utils/request/request.types";

import {
  TAuthRequest,
  TRegisterRequest,
  TUser,
  TResetPasswordRequest,
} from "./auth.model";

// ===== IRepository =====
export interface IAuthRepository {
  login(request: TAuthRequest): Promise<ApiResponse<TUser>>;
  register(request: TRegisterRequest): Promise<ApiResponse<null>>;
  fetchMe(): Promise<ApiResponse<TUser>>;
  updateProfile(user: Partial<TUser>): Promise<ApiResponse<TUser>>;
  logout(): Promise<ApiResponse<void>>;
  forgotPassword(request: {
    email?: string;
    phone?: string;
  }): Promise<ApiResponse<void>>;
  resetPassword(request: TResetPasswordRequest): Promise<ApiResponse<void>>;
  changePassword(request: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<ApiResponse<{ success: boolean }>>;
}
