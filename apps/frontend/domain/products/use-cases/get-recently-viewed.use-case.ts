import { IGetRecentlyViewedRequest } from "@ecommerce/shared";
import { IProductsRepository } from "../types/products.repository";

export class GetRecentlyViewedUseCase {
  constructor(private repo: IProductsRepository) {}

  async execute(query?: IGetRecentlyViewedRequest) {
    return this.repo.getRecentlyViewed(query);
  }
}
