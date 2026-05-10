import { delay } from "@/utils/delay";

import { IAuthRequest, IRegisterRequest, TUser } from "../model/auth.model";
import { IAuthRepository } from "../model/auth.repository";
import { UserMapper } from "./auth.mapper";
import { IUserResponse } from "./auth.response";

export class MockAuthRepository implements IAuthRepository {
  getSession(): boolean {
    throw new Error("Method not implemented.");
  }
  logout(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  private static MOCK_USER: IUserResponse = {
    id: "1",
    full_name: "John Doe",
    email_address: "john.doe@example.com",
    profile_picture: "https://i.pravatar.cc/150?u=1",
    date_of_birth: "20031990",
    address: "123 Premium St, Antigravity City",
  };

  async login(request: IAuthRequest): Promise<TUser> {
    await delay(1200);

    MockAuthRepository.MOCK_USER = {
      ...MockAuthRepository.MOCK_USER,
      full_name: request.email.split("@")[0] || "User",
      email_address: request.email,
    };

    return UserMapper.toDomain(MockAuthRepository.MOCK_USER);
  }

  async register(_request: IRegisterRequest): Promise<void> {
    await delay(1200);
  }

  async fetchMe(): Promise<TUser> {
    await delay(800);
    const user = UserMapper.toDomain(MockAuthRepository.MOCK_USER);
    return user;
  }

  async updateProfile(data: Partial<TUser>): Promise<TUser> {
    await delay(1000);

    MockAuthRepository.MOCK_USER = {
      ...MockAuthRepository.MOCK_USER,
      full_name: data.name || MockAuthRepository.MOCK_USER.full_name,
      email_address: data.email || MockAuthRepository.MOCK_USER.email_address,
      date_of_birth: data.dob || MockAuthRepository.MOCK_USER.date_of_birth,
      address: data.address || MockAuthRepository.MOCK_USER.address,
    };

    return UserMapper.toDomain(MockAuthRepository.MOCK_USER);
  }
}
