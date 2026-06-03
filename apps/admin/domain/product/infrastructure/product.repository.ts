import type {
  EProductSort,
  IApiResponse,
  IProductListResponse,
  IProductResponse,
  IUpdateProductRequest,
} from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import type { ApiListResponse } from "@/utils/request";
import { apiClient } from "@/utils/request/api-client";

import type { IAdminProduct } from "../types/product.model";
import type { IAdminProductRepository } from "../types/product.repository";
import { AdminProductMapper } from "./product.mapper";

export class AdminProductRepository implements IAdminProductRepository {
  async getProducts(
    page: number,
    limit: number,
    search?: string,
    sort?: EProductSort,
  ): Promise<ApiListResponse<IAdminProduct>> {
    const response = await apiClient.get<IApiResponse<IProductListResponse>>(
      API_ROUTES.PRODUCTS.LIST,
      {
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
          ...(sort != null ? { sort } : {}),
        },
      },
    );
    return AdminProductMapper.productListToDomain(response.data!);
  }

  async getProduct(slug: string): Promise<IAdminProduct> {
    const response = await apiClient.get<IApiResponse<IProductResponse>>(
      API_ROUTES.PRODUCTS.DETAIL(slug),
      {
        params: { all_translations: true },
      },
    );
    return AdminProductMapper.productToDomain(response.data!);
  }

  async updateProduct(
    id: string,
    data: IUpdateProductRequest,
  ): Promise<IAdminProduct> {
    const response = await apiClient.patch<IApiResponse<IProductResponse>>(
      `${API_ROUTES.PRODUCTS.LIST}/${id}`,
      data,
    );
    return AdminProductMapper.productToDomain(response.data!);
  }
}
