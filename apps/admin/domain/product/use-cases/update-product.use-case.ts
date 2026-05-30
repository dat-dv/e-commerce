import type {
  IApiResponse,
  IProductResponse,
  IUpdateProductRequest,
} from "@ecommerce/shared";

import type { IAdminProductRepository } from "../types/product.repository";

export class UpdateProductUseCase {
  constructor(private readonly productRepository: IAdminProductRepository) {}

  async execute(
    id: string,
    data: IUpdateProductRequest,
  ): Promise<IApiResponse<IProductResponse>> {
    return this.productRepository.updateProduct(id, data);
  }
}
