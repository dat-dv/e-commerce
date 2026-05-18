import { IProductsRepository } from "../types/products.repository";
import { TCreateReviewRequest } from "../types/products.model";

export class CreateReviewUseCase {
  constructor(private repo: IProductsRepository) {}

  async execute(data: TCreateReviewRequest) {
    return this.repo.createReview(data);
  }
}
