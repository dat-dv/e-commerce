import { API_ROUTES } from "@/constants/routes";
import { ApiResponse, TRequest } from "@/utils/request/request.types";

import {
  TAuthRequest,
  TRegisterRequest,
  TUser,
  TResetPasswordRequest,
} from "../types/auth.model";
import { IAuthRepository } from "../types/auth.repository";
import { UserMapper } from "./auth.mapper";
import { IUser } from "@ecommerce/shared";

export class AuthRepository implements IAuthRepository {
  constructor(private request: TRequest) {}

  async login(request: TAuthRequest): Promise<ApiResponse<TUser>> {
    const response = await this.request.post<IUser>(
      API_ROUTES.AUTH.LOGIN,
      request,
    );
    return {
      ...response,
      data: UserMapper.toDomain(response.data),
    };
  }

  async register(request: TRegisterRequest): Promise<ApiResponse<null>> {
    const payload = {
      email: request.email,
      password: request.password,
      confirm_password: request.confirmPassword,
    };
    return this.request.post(API_ROUTES.AUTH.REGISTER, payload);
  }

  async fetchMe(): Promise<ApiResponse<TUser>> {
    const response = await this.request.get<IUser>(API_ROUTES.AUTH.ME);
    return {
      ...response,
      data: UserMapper.toDomain(response.data),
    };
  }

  async updateProfile(data: Partial<TUser>): Promise<ApiResponse<TUser>> {
    const userDto = UserMapper.toDTO(data);
    const response = await this.request.patch<IUser>(
      API_ROUTES.USERS.PROFILE,
      userDto,
    );
    return {
      ...response,
      data: UserMapper.toDomain(response.data),
    };
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request.post(API_ROUTES.AUTH.LOGOUT, {});
  }

  async forgotPassword(request: {
    email?: string;
    phone?: string;
  }): Promise<ApiResponse<void>> {
    return this.request.post(API_ROUTES.AUTH.FORGOT_PASSWORD, request);
  }

  async resetPassword(
    request: TResetPasswordRequest,
  ): Promise<ApiResponse<void>> {
    return this.request.post(API_ROUTES.AUTH.RESET_PASSWORD, request);
  }

  async changePassword(request: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return this.request.post(API_ROUTES.AUTH.CHANGE_PASSWORD, request);
  }
}
