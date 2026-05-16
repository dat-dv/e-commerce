import { IUserFavoriteProductsRepository } from "../types/user-favorite-products.repository";

export class GetUserFavoriteProductsUseCase {
  constructor(private repo: IUserFavoriteProductsRepository) {}

  async execute(page: number = 1, limit: number = 10) {
    return this.repo.getUserFavoriteProducts(page, limit);
  }
}
