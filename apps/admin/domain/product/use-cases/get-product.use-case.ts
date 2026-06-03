import type { IApiResponse } from "@ecommerce/shared";

import { UseCase } from "@/utils/use-case";

import type { IAdminProduct } from "../types/product.model";
import type { IAdminProductRepository } from "../types/product.repository";

export class GetProductUseCase extends UseCase<
  string,
  Promise<IApiResponse<IAdminProduct>>
> {
  constructor(private repository: IAdminProductRepository) {
    super();
  }

  async execute(slug: string): Promise<IApiResponse<IAdminProduct>> {
    return this.repository.getProduct(slug);
  }
}
