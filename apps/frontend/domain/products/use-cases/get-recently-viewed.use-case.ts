import { IProductsRepository } from "../types/products.repository";

export class GetRecentlyViewedUseCase {
  constructor(private repo: IProductsRepository) {}

  async execute() {
    return this.repo.getRecentlyViewed();
  }
}
