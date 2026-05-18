import { IBrandsRepository } from "../types/brands.repository";
import { ApiResponse } from "@/utils/request/request.types";
import { TCategory } from "@/domain/categories/types/categories.model";

export class GetBrandCategoriesUseCase {
  constructor(private brandsRepository: IBrandsRepository) {}

  execute(slug: string): Promise<ApiResponse<TCategory[]>> {
    return this.brandsRepository.getBrandCategoryTree(slug);
  }
}
