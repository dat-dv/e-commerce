import { IProductsRepository } from "../types/products.repository";

export class GetFlashSaleUseCase {
  constructor(private repo: IProductsRepository) {}

  async execute() {
    return this.repo.getFlashSale();
  }
}
