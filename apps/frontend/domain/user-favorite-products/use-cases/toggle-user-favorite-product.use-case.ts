import { IUserFavoriteProductsRepository } from "../types/user-favorite-products.repository";

export class ToggleUserFavoriteProductUseCase {
  constructor(private repo: IUserFavoriteProductsRepository) {}

  async execute(productId: string) {
    return this.repo.toggle(productId);
  }
}
