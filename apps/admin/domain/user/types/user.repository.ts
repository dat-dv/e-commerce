import { type IApiResponse } from "@ecommerce/shared";

import { ApiListResponse } from "@/utils/request";

import { type IAdminUser } from "./user.model";

export interface IAdminUserRepository {
  getUsers(page?: number, limit?: number): Promise<ApiListResponse<IAdminUser>>;
  getUser(id: string): Promise<IAdminUser>;
  updateUser(
    id: string,
    data: {
      first_name?: string;
      last_name?: string;
      role_id?: string;
    },
  ): Promise<IAdminUser>;
  deleteUser(id: string): Promise<IApiResponse<boolean>>;
}
