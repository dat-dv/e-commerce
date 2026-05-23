import { appRequest } from "@/constants/app-request";
import { UserFavoriteProductsRepository } from "../infrastructure/user-favorite-products.repository";
import { GetUserFavoriteProductsUseCase } from "./get-user-favorite-products.use-case";
import { ToggleUserFavoriteProductUseCase } from "./toggle-user-favorite-product.use-case";

const userFavoriteProductsRepo = new UserFavoriteProductsRepository(appRequest);

export const userFavoriteProductsUseCase = {
  toggleUserFavoriteProductUseCase: new ToggleUserFavoriteProductUseCase(
    userFavoriteProductsRepo,
  ),
  getUserFavoriteProductsUseCase: new GetUserFavoriteProductsUseCase(
    userFavoriteProductsRepo,
  ),
};
