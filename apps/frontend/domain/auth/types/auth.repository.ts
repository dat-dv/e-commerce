import { ApiResponse } from "@/utils/request/request.types";

import {
  IAuthRequest,
  IRegisterRequest,
  TUser,
  IResetPasswordRequest,
} from "./auth.model";

// ===== IRepository =====
export interface IAuthRepository {
  login(request: IAuthRequest): Promise<ApiResponse<TUser>>;
  register(request: IRegisterRequest): Promise<ApiResponse<void>>;
  fetchMe(): Promise<ApiResponse<TUser>>;
  updateProfile(user: Partial<TUser>): Promise<ApiResponse<TUser>>;
  logout(): Promise<ApiResponse<void>>;
  forgotPassword(request: {
    email?: string;
    phone?: string;
  }): Promise<ApiResponse<void>>;
  resetPassword(request: IResetPasswordRequest): Promise<ApiResponse<void>>;
  verifyPhone(request: {
    token: string;
    phone: string;
    phone_code: string;
  }): Promise<ApiResponse<{ success: boolean }>>;
}
