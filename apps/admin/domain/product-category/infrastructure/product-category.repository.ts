import type { IApiResponse, ICategoryTreeResponse } from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { AdminProductMapper, type IAdminCategory } from "@/domain/product";
import { apiClient } from "@/utils/request/api-client";

import type { IAdminProductCategoryRepository } from "../types/product-category.repository";

export class AdminProductCategoryRepository implements IAdminProductCategoryRepository {
  async getCategoryTree(): Promise<IAdminCategory[]> {
    const response = await apiClient.get<IApiResponse<ICategoryTreeResponse>>(
      API_ROUTES.PRODUCT_CATEGORIES.TREE,
    );
    return AdminProductMapper.categoryTreeToDomain(response.data ?? []);
  }
}
