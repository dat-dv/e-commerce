import { UserFavoriteProductsRepository } from "../infrastructure/user-favorite-products.repository";
import { ToggleUserFavoriteProductUseCase } from "./toggle-user-favorite-product.use-case";
import { GetUserFavoriteProductsUseCase } from "./get-user-favorite-products.use-case";
import { appRequest } from "@/utils/request/request";

const userFavoriteProductsRepo = new UserFavoriteProductsRepository(appRequest);

export const userFavoriteProductsUseCase = {
  toggleUserFavoriteProductUseCase: new ToggleUserFavoriteProductUseCase(
    userFavoriteProductsRepo,
  ),
  getUserFavoriteProductsUseCase: new GetUserFavoriteProductsUseCase(
    userFavoriteProductsRepo,
  ),
};
