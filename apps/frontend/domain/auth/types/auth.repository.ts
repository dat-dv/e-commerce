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
  register(request: IRegisterRequest): Promise<ApiResponse<null>>;
  fetchMe(): Promise<ApiResponse<TUser>>;
  updateProfile(user: Partial<TUser>): Promise<ApiResponse<TUser>>;
  logout(): Promise<ApiResponse<void>>;
  forgotPassword(request: {
    email?: string;
    phone?: string;
  }): Promise<ApiResponse<void>>;
  resetPassword(request: IResetPasswordRequest): Promise<ApiResponse<void>>;
  changePassword(request: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<ApiResponse<{ success: boolean }>>;
}
