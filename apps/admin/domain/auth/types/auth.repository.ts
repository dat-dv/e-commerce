import { type IAdminUser } from "@/domain/user";
import { type ApiResponse } from "@/utils/request/api-client.types";

import {
  type TAdminForgotPasswordRequest,
  type TAdminSignInRequest,
} from "./auth.model";

export interface IAdminAuthRepository {
  login(request: TAdminSignInRequest): Promise<ApiResponse<IAdminUser>>;
  forgotPassword(
    request: TAdminForgotPasswordRequest,
  ): Promise<ApiResponse<void>>;
}
