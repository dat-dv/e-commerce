import { ApiResponse } from "@/utils/request/request.types";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { IBrandsRepository } from "../types/brands.repository";

export class GetBrandBySlugUseCase {
  constructor(private brandsRepository: IBrandsRepository) {}

  async execute(slug: string): Promise<ApiResponse<TBrand>> {
    return this.brandsRepository.getBrandBySlug(slug);
  }
}
