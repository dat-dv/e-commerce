import { IProductsRepository } from "../types/products.repository";

export class GetSimilarProductsUseCase {
  constructor(private repo: IProductsRepository) {}

  async execute(productId: string, limit: number) {
    return this.repo.getSimilarProducts(productId, limit);
  }
}
