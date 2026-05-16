import { delay } from "@/utils/delay";

import { ApiResponse } from "@/utils/request/request.types";

import {
  TAuthRequest,
  TRegisterRequest,
  TUser,
  TResetPasswordRequest,
} from "../types/auth.model";
import { TUpdateUserInput } from "../../users/types/user.model";
import { IAuthRepository } from "../types/auth.repository";
import { UserMapper } from "./auth.mapper";
import { IUserResponse } from "@ecommerce/shared";

export class MockAuthRepository implements IAuthRepository {
  getSession(): boolean {
    throw new Error("Method not implemented.");
  }
  async logout(): Promise<ApiResponse<void>> {
    throw new Error("Method not implemented.");
  }
  private static MOCK_USER: IUserResponse = {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    avatar_id: "https://i.pravatar.cc/150?u=1",
    date_of_birth: new Date("1990-03-20"),
    created_at: new Date(),
    updated_at: new Date(),
    password: "hashed_password",
    salt: "salt",
    role_id: "user_role_id",
    gender: 0,
    deleted_at: null,
    phones: [
      {
        id: "phone_1",
        phone_number: "123456789",
        phone_code: "+84",
        is_default: true,
        is_verified: true,
        user_id: "1",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
  };

  async login(request: TAuthRequest): Promise<ApiResponse<TUser>> {
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

  async register(_request: TRegisterRequest): Promise<ApiResponse<null>> {
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

  async updateProfile(data: TUpdateUserInput): Promise<ApiResponse<TUser>> {
    await delay(1000);

    MockAuthRepository.MOCK_USER = {
      ...MockAuthRepository.MOCK_USER,
      first_name: data.firstName || MockAuthRepository.MOCK_USER.first_name,
      last_name: data.lastName || MockAuthRepository.MOCK_USER.last_name,
      email: MockAuthRepository.MOCK_USER.email,
      date_of_birth: data.dateOfBirth
        ? new Date(data.dateOfBirth)
        : MockAuthRepository.MOCK_USER.date_of_birth,
      avatar_id: MockAuthRepository.MOCK_USER.avatar_id,
      phones: [
        {
          ...MockAuthRepository.MOCK_USER.phones![0],
          phone_number:
            data.phoneNumber ||
            MockAuthRepository.MOCK_USER.phones![0].phone_number,
          phone_code:
            data.phoneCode ||
            MockAuthRepository.MOCK_USER.phones![0].phone_code,
        },
      ],
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
    request: TResetPasswordRequest,
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
