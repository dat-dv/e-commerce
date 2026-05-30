import type { IApiResponse, IProductListResponse } from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/utils/request/api-client";

import type { IAdminProductRepository } from "../types/product.repository";

export class AdminProductRepository implements IAdminProductRepository {
  async getProducts(
    page: number,
    limit: number,
  ): Promise<IApiResponse<IProductListResponse>> {
    const response = await apiClient.get<IApiResponse<IProductListResponse>>(
      API_ROUTES.PRODUCTS.LIST,
      {
        params: { page, limit },
      },
    );
    return response;
  }
}
