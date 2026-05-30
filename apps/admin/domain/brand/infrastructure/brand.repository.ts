import type {
  IApiResponse,
  IBrandListResponse,
  IGetBrandListRequest,
} from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/utils/request/api-client";

import type { IAdminBrandRepository } from "../types/brand.repository";

export class AdminBrandRepository implements IAdminBrandRepository {
  async getBrands(
    params?: IGetBrandListRequest,
  ): Promise<IApiResponse<IBrandListResponse>> {
    const response = await apiClient.get<IApiResponse<IBrandListResponse>>(
      API_ROUTES.BRANDS.LIST,
      {
        params,
      },
    );
    return response;
  }
}
