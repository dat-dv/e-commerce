import { IProductsRepository } from "../types/products.repository";

export class GetRecommendedUseCase {
  constructor(private repo: IProductsRepository) {}

  async execute() {
    return this.repo.getRecommended();
  }
}
