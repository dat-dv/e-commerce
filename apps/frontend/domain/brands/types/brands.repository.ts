import { ApiResponse, ApiListResponse } from "@/utils/request/request.types";
import { IBrand } from "@/domain/homepage/types/homepage.model";

export interface IBrandsRepository {
  getTopBrands(
    page?: number,
    limit?: number,
  ): Promise<ApiResponse<ApiListResponse<IBrand>>>;
}
