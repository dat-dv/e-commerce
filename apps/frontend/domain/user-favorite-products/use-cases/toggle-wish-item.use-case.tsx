import { IUserFavoriteProductsRepository } from "../types/user-favorite-products.repository";

export class ToggleWishItemUseCase {
  constructor(private readonly repo: IUserFavoriteProductsRepository) {}

  async execute(productId: string) {
    return this.repo.toggle(productId);
  }
}
