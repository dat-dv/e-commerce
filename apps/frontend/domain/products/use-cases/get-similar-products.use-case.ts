import { IProductsRepository } from "../types/products.repository";

export class GetSimilarProductsUseCase {
  constructor(private repo: IProductsRepository) {}

  async execute(productId: string, limit = 4) {
    return this.repo.getSimilarProducts(productId, limit);
  }
}
