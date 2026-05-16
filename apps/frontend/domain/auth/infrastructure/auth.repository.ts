import { API_ROUTES } from "@/constants/routes";
import { ApiResponse, TRequest } from "@/utils/request/request.types";

import {
  TAuthRequest,
  TRegisterRequest,
  TUser,
  TResetPasswordRequest,
  TUpdateProfileRequest,
} from "../types/auth.model";
import { IAuthRepository } from "../types/auth.repository";
import { UserMapper } from "./auth.mapper";
import { IUserResponse } from "@ecommerce/shared";

export class AuthRepository implements IAuthRepository {
  constructor(private request: TRequest) {}

  async login(request: TAuthRequest): Promise<ApiResponse<TUser>> {
    const response = await this.request.post<IUserResponse>(
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
    const response = await this.request.get<IUserResponse>(API_ROUTES.AUTH.ME);
    return {
      ...response,
      data: UserMapper.toDomain(response.data),
    };
  }

  async updateProfile(
    data: TUpdateProfileRequest,
  ): Promise<ApiResponse<TUser>> {
    const userDto = UserMapper.toDTO(data);
    const response = await this.request.patch<IUserResponse>(
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
    const payload = {
      token: request.token,
      new_password: request.newPassword,
      confirm_password: request.confirmPassword,
    };
    return this.request.post(API_ROUTES.AUTH.RESET_PASSWORD, payload);
  }

  async changePassword(request: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    const payload = {
      old_password: request.oldPassword,
      new_password: request.newPassword,
      confirm_password: request.confirmPassword,
    };
    return this.request.post(API_ROUTES.AUTH.CHANGE_PASSWORD, payload);
  }
}
