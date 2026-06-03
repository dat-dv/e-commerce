import type {
  IApiResponse,
  IBrandListResponse,
  IGetBrandListRequest,
} from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { AdminProductMapper, type IAdminBrand } from "@/domain/product";
import type { ApiListResponse } from "@/utils/request";
import { apiClient } from "@/utils/request/api-client";

import type { IAdminBrandRepository } from "../types/brand.repository";

export class AdminBrandRepository implements IAdminBrandRepository {
  async getBrands(
    params?: IGetBrandListRequest,
  ): Promise<ApiListResponse<IAdminBrand>> {
    const response = await apiClient.get<IApiResponse<IBrandListResponse>>(
      API_ROUTES.BRANDS.LIST,
      {
        params,
      },
    );
    return {
      items:
        response.data?.items.map((brand) =>
          AdminProductMapper.brandToDomain(brand),
        ) ?? [],
      meta: response.data?.meta ?? {
        total: 0,
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        totalPages: 0,
      },
    };
  }
}
