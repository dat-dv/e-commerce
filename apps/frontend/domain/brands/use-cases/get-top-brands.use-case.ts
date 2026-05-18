import { IBrandsRepository } from "../types/brands.repository";
import { ApiResponse, ApiListResponse } from "@/utils/request/request.types";
import { TBrand } from "@/domain/homepage/types/homepage.model";

export class GetTopBrandsUseCase {
  constructor(private repo: IBrandsRepository) {}

  async execute(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<ApiResponse<ApiListResponse<TBrand>>> {
    return this.repo.getTopBrands(page, limit, search);
  }
}
