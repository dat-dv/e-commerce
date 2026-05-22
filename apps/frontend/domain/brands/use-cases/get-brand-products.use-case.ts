import { TProduct } from "@/domain/products/types/products.model";
import { ApiListResponse, ApiResponse } from "@/utils/request/request.types";
import { IGetBrandProductsRequest } from "@ecommerce/shared";
import { IBrandsRepository } from "../types/brands.repository";

export class GetBrandProductsUseCase {
  constructor(private brandsRepository: IBrandsRepository) {}

  async execute(
    slug: string,
    query: IGetBrandProductsRequest,
  ): Promise<ApiResponse<ApiListResponse<TProduct>>> {
    return this.brandsRepository.getBrandProducts(slug, query);
  }
}
