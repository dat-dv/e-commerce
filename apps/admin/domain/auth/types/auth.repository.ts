import { type IApiResponse } from "@ecommerce/shared";

import { type IAdminUser } from "@/domain/user";

import {
  type TAdminForgotPasswordRequest,
  type TAdminSignInRequest,
} from "./auth.model";

export interface IAdminAuthRepository {
  login(request: TAdminSignInRequest): Promise<IApiResponse<IAdminUser>>;
  forgotPassword(
    request: TAdminForgotPasswordRequest,
  ): Promise<IApiResponse<void>>;
  fetchMe(): Promise<IApiResponse<IAdminUser>>;
}
