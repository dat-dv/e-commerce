import { ApiResponse } from "@/utils/request/request.types";

import { IAuthRequest, IRegisterRequest, TUser } from "./auth.model";

// ===== IRepository =====
export interface IAuthRepository {
  login(request: IAuthRequest): Promise<ApiResponse<TUser>>;
  register(request: IRegisterRequest): Promise<ApiResponse<void>>;
  fetchMe(): Promise<ApiResponse<TUser>>;
  updateProfile(user: Partial<TUser>): Promise<ApiResponse<TUser>>;
  logout(): Promise<ApiResponse<void>>;
}
