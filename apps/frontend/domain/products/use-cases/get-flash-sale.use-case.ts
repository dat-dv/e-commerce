import { IProductsRepository } from "../types/products.repository";

export class GetFlashSaleUseCase {
  constructor(private repo: IProductsRepository) {}

  async execute(params?: { page?: number; limit?: number }) {
    return this.repo.getFlashSale(params);
  }
}
