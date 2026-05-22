import { IGetUserFavoriteProductsRequest } from "@ecommerce/shared";
import { IUserFavoriteProductsRepository } from "../types/user-favorite-products.repository";

export class GetUserFavoriteProductsUseCase {
  constructor(private repo: IUserFavoriteProductsRepository) {}

  async execute(query?: IGetUserFavoriteProductsRequest) {
    return this.repo.getUserFavoriteProducts(query);
  }
}
