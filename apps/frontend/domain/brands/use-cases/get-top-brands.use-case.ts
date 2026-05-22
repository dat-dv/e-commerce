import { TBrand } from "@/domain/homepage/types/homepage.model";
import { ApiListResponse, ApiResponse } from "@/utils/request/request.types";
import { IGetBrandListRequest } from "@ecommerce/shared";
import { IBrandsRepository } from "../types/brands.repository";

export class GetBrandListUseCase {
  constructor(private repo: IBrandsRepository) {}

  async execute(
    query: IGetBrandListRequest,
  ): Promise<ApiResponse<ApiListResponse<TBrand>>> {
    return this.repo.getBrandList(query);
  }
}
