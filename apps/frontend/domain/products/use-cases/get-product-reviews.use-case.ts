import { IProductsRepository } from "../types/products.repository";

export class GetProductReviewsUseCase {
  constructor(private repo: IProductsRepository) {}

  async execute(productId: string, page = 1, limit = 10) {
    return this.repo.getProductReviews(productId, page, limit);
  }
}
