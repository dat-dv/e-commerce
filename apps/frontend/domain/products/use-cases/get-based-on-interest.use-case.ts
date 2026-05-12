import { IProductsRepository } from "../types/products.repository";

export class GetBasedOnInterestUseCase {
  constructor(private repo: IProductsRepository) {}

  async execute() {
    return this.repo.getBasedOnInterest();
  }
}
