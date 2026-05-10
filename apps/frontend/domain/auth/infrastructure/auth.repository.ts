import { API_ROUTES } from "@/constants/routes";
import { TRequest } from "@/utils/request/request.types";

import { IAuthRequest, IRegisterRequest, TUser } from "../model/auth.model";
import { IAuthRepository } from "../model/auth.repository";
import { UserMapper } from "./auth.mapper";
import { IUserResponse } from "./auth.response";

export class AuthRepository implements IAuthRepository {
  constructor(private request: TRequest) {}

  async login(request: IAuthRequest): Promise<TUser> {
    const userRes = await this.request.post<IUserResponse>(
      API_ROUTES.AUTH.LOGIN,
      request,
    );
    return UserMapper.toDomain(userRes);
  }

  async register(request: IRegisterRequest): Promise<void> {
    await this.request.post(API_ROUTES.AUTH.REGISTER, request);
  }

  async fetchMe(): Promise<TUser> {
    const data = await this.request.get<IUserResponse>(API_ROUTES.AUTH.ME);
    return UserMapper.toDomain(data);
  }

  async updateProfile(data: Partial<TUser>): Promise<TUser> {
    const userDto = UserMapper.toDTO(data);
    const updatedUser = await this.request.put<IUserResponse>(
      API_ROUTES.AUTH.ME,
      userDto,
    );
    return UserMapper.toDomain(updatedUser);
  }

  async logout() {
    await this.request.post(API_ROUTES.AUTH.LOGOUT, {});
  }
}
