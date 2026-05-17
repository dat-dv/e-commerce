import { IProductsRepository } from "../types/products.repository";

export class GetRecentlyViewedUseCase {
  constructor(private repo: IProductsRepository) {}

  async execute(params?: { page?: number; limit?: number }) {
    return this.repo.getRecentlyViewed(params);
  }
}
