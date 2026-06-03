import { AdminUserRepository } from "../infrastructure/user.repository";
import {
  AdminDeleteUserUseCase,
  AdminGetUserAvatarsUseCase,
  AdminGetUserCartUseCase,
  AdminGetUserFavoritesUseCase,
  AdminGetUserOrdersUseCase,
  AdminGetUsersUseCase,
  AdminGetUserUseCase,
  AdminUpdateUserUseCase,
} from "./user.use-cases";

const repo = new AdminUserRepository();

export const adminUserUseCase = {
  getUsers: new AdminGetUsersUseCase(repo),
  getUser: new AdminGetUserUseCase(repo),
  getUserAvatars: new AdminGetUserAvatarsUseCase(repo),
  getUserOrders: new AdminGetUserOrdersUseCase(repo),
  getUserCart: new AdminGetUserCartUseCase(repo),
  getUserFavorites: new AdminGetUserFavoritesUseCase(repo),
  updateUser: new AdminUpdateUserUseCase(repo),
  deleteUser: new AdminDeleteUserUseCase(repo),
};
