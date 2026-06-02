import { type IApiResponse } from "@ecommerce/shared";
import { type IGetUsersRequest } from "@ecommerce/shared";

import { ApiListResponse } from "@/utils/request";

import {
  type IAdminCustomerActivityItem,
  type IAdminCustomerCart,
  type IAdminCustomerFavoriteProduct,
  type IAdminCustomerOrder,
  type IAdminUpdateUserInput,
  type IAdminUser,
  type IAdminUserAvatar,
} from "./user.model";

export interface IAdminUserRepository {
  getUsers(params: IGetUsersRequest): Promise<ApiListResponse<IAdminUser>>;
  getUser(id: string): Promise<IAdminUser>;
  getUserAvatars(id: string): Promise<IAdminUserAvatar[]>;
  getUserOrders(
    id: string,
    params?: { page?: number; limit?: number },
  ): Promise<ApiListResponse<IAdminCustomerOrder>>;
  getUserCart(id: string): Promise<IAdminCustomerCart>;
  getUserFavorites(
    id: string,
    params?: { page?: number; limit?: number },
  ): Promise<ApiListResponse<IAdminCustomerFavoriteProduct>>;
  getUserActivity(id: string): Promise<IAdminCustomerActivityItem[]>;
  updateUser(id: string, data: IAdminUpdateUserInput): Promise<IAdminUser>;
  deleteUser(id: string): Promise<IApiResponse<boolean>>;
}
