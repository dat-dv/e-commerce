import { IProductsRepository } from "../types/products.repository";

export class GetRecommendedUseCase {
  constructor(private repo: IProductsRepository) {}

  async execute(params?: { page?: number; limit?: number }) {
    return this.repo.getRecommended(params);
  }
}
