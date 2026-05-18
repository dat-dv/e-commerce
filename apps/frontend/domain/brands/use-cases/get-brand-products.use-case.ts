import { ApiResponse, ApiListResponse } from "@/utils/request/request.types";
import { TProduct } from "@/domain/products/types/products.model";
import { IBrandsRepository } from "../types/brands.repository";

export class GetBrandProductsUseCase {
  constructor(private brandsRepository: IBrandsRepository) {}

  async execute(
    slug: string,
    page?: number,
    limit?: number,
    search?: string,
    category?: string,
  ): Promise<ApiResponse<ApiListResponse<TProduct>>> {
    return this.brandsRepository.getBrandProducts(
      slug,
      page,
      limit,
      search,
      category,
    );
  }
}
