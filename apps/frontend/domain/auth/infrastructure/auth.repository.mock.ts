import { delay } from "@/utils/delay";

import { ApiResponse } from "@/utils/request/request.types";

import {
  IAuthRequest,
  IRegisterRequest,
  TUser,
  IResetPasswordRequest,
} from "../types/auth.model";
import { IAuthRepository } from "../types/auth.repository";
import { UserMapper } from "./auth.mapper";
import { IAppUserResponse } from "../types/auth.response";

export class MockAuthRepository implements IAuthRepository {
  getSession(): boolean {
    throw new Error("Method not implemented.");
  }
  async logout(): Promise<ApiResponse<void>> {
    throw new Error("Method not implemented.");
  }
  private static MOCK_USER: IAppUserResponse = {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    avatar_id: "https://i.pravatar.cc/150?u=1",
    date_of_birth: "20031990",
  };

  async login(request: IAuthRequest): Promise<ApiResponse<TUser>> {
    await delay(1200);

    MockAuthRepository.MOCK_USER = {
      ...MockAuthRepository.MOCK_USER,
      first_name: request.email.split("@")[0] || "User",
      last_name: "",
      email: request.email,
    };

    return {
      data: UserMapper.toDomain(MockAuthRepository.MOCK_USER),
      status: "success",
    };
  }

  async register(_request: IRegisterRequest): Promise<ApiResponse<null>> {
    await delay(1200);
    return {
      data: null,
      status: "success",
    };
  }

  async fetchMe(): Promise<ApiResponse<TUser>> {
    await delay(800);
    const user = UserMapper.toDomain(MockAuthRepository.MOCK_USER);
    return {
      data: user,
      status: "success",
    };
  }

  async updateProfile(data: Partial<TUser>): Promise<ApiResponse<TUser>> {
    await delay(1000);

    MockAuthRepository.MOCK_USER = {
      ...MockAuthRepository.MOCK_USER,
      first_name: data.first_name || MockAuthRepository.MOCK_USER.first_name,
      last_name: data.last_name || MockAuthRepository.MOCK_USER.last_name,
      email: data.email || MockAuthRepository.MOCK_USER.email,
      date_of_birth:
        data.date_of_birth || MockAuthRepository.MOCK_USER.date_of_birth,
      avatar_id: data.avatar_id || MockAuthRepository.MOCK_USER.avatar_id,
    };

    return {
      data: UserMapper.toDomain(MockAuthRepository.MOCK_USER),
      status: "success",
    };
  }

  async forgotPassword(request: {
    email?: string;
    phone?: string;
  }): Promise<ApiResponse<void>> {
    await delay(500);
    return { data: undefined, status: "success" };
  }

  async resetPassword(
    request: IResetPasswordRequest,
  ): Promise<ApiResponse<void>> {
    await delay(500);
    return { data: undefined, status: "success" };
  }

  async changePassword(request: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    await delay(500);
    return { data: { success: true }, status: "success" };
  }
}
