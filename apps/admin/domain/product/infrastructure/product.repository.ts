import type {
  IApiResponse,
  IProductListResponse,
  IProductResponse,
  IUpdateProductRequest,
} from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/utils/request/api-client";

import type {
  IAdminProduct,
  IAdminProductListResponse,
} from "../types/product.model";
import type { IAdminProductRepository } from "../types/product.repository";
import { AdminProductMapper } from "./product.mapper";

export class AdminProductRepository implements IAdminProductRepository {
  async getProducts(
    page: number,
    limit: number,
    search?: string,
  ): Promise<IApiResponse<IAdminProductListResponse>> {
    const response = await apiClient.get<IApiResponse<IProductListResponse>>(
      API_ROUTES.PRODUCTS.LIST,
      {
        params: { page, limit, ...(search ? { search } : {}) },
      },
    );
    return {
      ...response,
      data: AdminProductMapper.productListToDomain(response.data),
    };
  }

  async getProduct(slug: string): Promise<IApiResponse<IAdminProduct>> {
    const response = await apiClient.get<IApiResponse<IProductResponse>>(
      API_ROUTES.PRODUCTS.DETAIL(slug),
      {
        params: { all_translations: true },
      },
    );
    return {
      ...response,
      data: AdminProductMapper.productToDomain(response.data),
    };
  }

  async updateProduct(
    id: string,
    data: IUpdateProductRequest,
  ): Promise<IApiResponse<IAdminProduct>> {
    const response = await apiClient.patch<IApiResponse<IProductResponse>>(
      `${API_ROUTES.PRODUCTS.LIST}/${id}`,
      data,
    );
    return {
      ...response,
      data: AdminProductMapper.productToDomain(response.data),
    };
  }
}
