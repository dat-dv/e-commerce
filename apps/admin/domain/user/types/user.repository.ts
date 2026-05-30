import { type IApiResponse } from "@ecommerce/shared";

import { ApiListResponse } from "@/utils/request";

import { type IAdminUser } from "./user.model";

export interface IAdminUserRepository {
  getUsers(page?: number, limit?: number): Promise<ApiListResponse<IAdminUser>>;
  deleteUser(id: string): Promise<IApiResponse<boolean>>;
}
