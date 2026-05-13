import {
  ApiResponse,
  TRequest,
  ApiListResponse,
} from "@/utils/request/request.types";
import { IBrand } from "@/domain/homepage/types/homepage.model";
import { IBrandResponse } from "@/domain/homepage/types/homepage.response";
import { IBrandsRepository } from "../types/brands.repository";
import { BrandMapper } from "./brands.mapper";
import { API_ROUTES } from "@/constants/routes";

export class BrandsRepository implements IBrandsRepository {
  constructor(private request: TRequest) {}

  async getTopBrands(
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<ApiListResponse<IBrand>>> {
    const response = await this.request.get<{
      data: IBrandResponse[];
      total: number;
    }>(`${API_ROUTES.BRAND.TOP}`, { params: { page, limit } });

    return {
      ...response,
      data: response.data
        ? {
            items: response.data.data.map((item) => BrandMapper.toDomain(item)),
            meta: {
              total: response.data.total,
              page,
              limit,
              totalPages: Math.ceil(response.data.total / limit),
            },
          }
        : {
            items: [],
            meta: { total: 0, page, limit, totalPages: 0 },
          },
    };
  }
}
