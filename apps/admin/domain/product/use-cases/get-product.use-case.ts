import type { IApiResponse, IProductResponse } from "@ecommerce/shared";

import { UseCase } from "@/utils/use-case";

import type { IAdminProductRepository } from "../types/product.repository";

export class GetProductUseCase extends UseCase<
  string,
  Promise<IApiResponse<IProductResponse>>
> {
  constructor(private repository: IAdminProductRepository) {
    super();
  }

  async execute(slug: string): Promise<IApiResponse<IProductResponse>> {
    return this.repository.getProduct(slug);
  }
}
