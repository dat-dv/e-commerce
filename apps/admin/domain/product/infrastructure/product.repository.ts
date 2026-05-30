import type {
  IApiResponse,
  IProductListResponse,
  IProductResponse,
} from "@ecommerce/shared";

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

  async getProduct(slug: string): Promise<IApiResponse<IProductResponse>> {
    const response = await apiClient.get<IApiResponse<IProductResponse>>(
      API_ROUTES.PRODUCTS.DETAIL(slug),
    );
    return response;
  }
}
