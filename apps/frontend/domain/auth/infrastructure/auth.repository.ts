import { API_ROUTES } from "@/constants/routes";
import { ApiResponse, TRequest } from "@/utils/request/request.types";

import { IAuthRequest, IRegisterRequest, TUser } from "../types/auth.model";
import { IAuthRepository } from "../types/auth.repository";
import { UserMapper } from "./auth.mapper";
import { IAppUserResponse } from "../types/auth.response";

export class AuthRepository implements IAuthRepository {
  constructor(private request: TRequest) {}

  async login(request: IAuthRequest): Promise<ApiResponse<TUser>> {
    const response = await this.request.post<IAppUserResponse>(
      API_ROUTES.AUTH.LOGIN,
      request,
    );
    return {
      ...response,
      data: UserMapper.toDomain(response.data),
    };
  }

  async register(request: IRegisterRequest): Promise<ApiResponse<void>> {
    const payload = {
      email: request.email,
      password: request.password,
      confirm_password: request.confirmPassword,
    };
    return this.request.post(API_ROUTES.AUTH.REGISTER, payload);
  }

  async fetchMe(): Promise<ApiResponse<TUser>> {
    const response = await this.request.get<IAppUserResponse>(
      API_ROUTES.AUTH.ME,
    );
    return {
      ...response,
      data: UserMapper.toDomain(response.data),
    };
  }

  async updateProfile(data: Partial<TUser>): Promise<ApiResponse<TUser>> {
    const userDto = UserMapper.toDTO(data);
    const response = await this.request.patch<IAppUserResponse>(
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
}
