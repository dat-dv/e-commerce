import { IBrandsRepository } from "../types/brands.repository";
import { ApiResponse, ApiListResponse } from "@/utils/request/request.types";
import { IBrand } from "@/domain/homepage/types/homepage.model";

export class GetTopBrandsUseCase {
  constructor(private repo: IBrandsRepository) {}

  async execute(
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<ApiListResponse<IBrand>>> {
    return this.repo.getTopBrands(page, limit);
  }
}
