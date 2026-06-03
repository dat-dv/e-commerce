import { type IAdminUser } from "@/domain/user";

import {
  type TAdminForgotPasswordRequest,
  type TAdminSignInRequest,
} from "./auth.model";

export interface IAdminAuthRepository {
  login(request: TAdminSignInRequest): Promise<IAdminUser>;
  forgotPassword(request: TAdminForgotPasswordRequest): Promise<void>;
  fetchMe(): Promise<IAdminUser>;
  logout(): Promise<void>;
}
