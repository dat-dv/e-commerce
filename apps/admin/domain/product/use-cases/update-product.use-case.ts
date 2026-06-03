import type { IUpdateProductRequest } from "@ecommerce/shared";

import type { IAdminProduct } from "../types/product.model";
import type { IAdminProductRepository } from "../types/product.repository";

export class UpdateProductUseCase {
  constructor(private readonly productRepository: IAdminProductRepository) {}

  async execute(
    id: string,
    data: IUpdateProductRequest,
  ): Promise<IAdminProduct> {
    return this.productRepository.updateProduct(id, data);
  }
}
