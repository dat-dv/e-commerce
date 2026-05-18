import { IProductsRepository } from "../types/products.repository";
import { TGetProductReviewsRequest } from "../types/products.model";

export class GetProductReviewsUseCase {
  constructor(private repo: IProductsRepository) {}

  async execute(productId: string, params?: TGetProductReviewsRequest) {
    return this.repo.getProductReviews(productId, params);
  }
}
