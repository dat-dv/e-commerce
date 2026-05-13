import {
  ApiResponse,
  TRequest,
  ApiListResponse,
} from "@/utils/request/request.types";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { IBrand } from "@ecommerce/shared";
import { IBrandsRepository } from "../types/brands.repository";
import { BrandMapper } from "./brands.mapper";
import { API_ROUTES } from "@/constants/routes";

export class BrandsRepository implements IBrandsRepository {
  constructor(private request: TRequest) {}

  async getTopBrands(
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<ApiListResponse<TBrand>>> {
    const response = await this.request.get<{
      items: IBrand[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`${API_ROUTES.BRAND.TOP}`, { params: { page, limit } });

    return {
      ...response,
      data: response.data
        ? {
            items: response.data.items.map((item) =>
              BrandMapper.toDomain(item),
            ),
            meta: response.data.meta,
          }
        : {
            items: [],
            meta: { total: 0, page, limit, totalPages: 0 },
          },
    };
  }
}
