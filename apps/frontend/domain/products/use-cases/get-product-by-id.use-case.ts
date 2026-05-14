import { TProduct } from "@/domain/products/types/products.model";
import { ProductsRepository } from "@/domain/products/infrastructure/products.repository";
import { ApiResponse } from "@/utils/request/request.types";

export class GetProductByIdUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(id: string): Promise<ApiResponse<TProduct | null>> {
    return this.productsRepository.getProductBySlug(id);
  }
}
