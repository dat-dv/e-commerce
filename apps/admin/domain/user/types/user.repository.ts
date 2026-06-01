import { type IApiResponse } from "@ecommerce/shared";

import { ApiListResponse } from "@/utils/request";

import {
  type IAdminUpdateUserInput,
  type IAdminUser,
  type IAdminUserAvatar,
} from "./user.model";

export interface IAdminUserRepository {
  getUsers(
    page?: number,
    limit?: number,
    search?: string,
  ): Promise<ApiListResponse<IAdminUser>>;
  getUser(id: string): Promise<IAdminUser>;
  getUserAvatars(id: string): Promise<IAdminUserAvatar[]>;
  updateUser(id: string, data: IAdminUpdateUserInput): Promise<IAdminUser>;
  deleteUser(id: string): Promise<IApiResponse<boolean>>;
}
