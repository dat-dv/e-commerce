import type { IApiResponse, ICategoryTreeResponse } from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/utils/request/api-client";

import type { IAdminProductCategoryRepository } from "../types/product-category.repository";

export class AdminProductCategoryRepository implements IAdminProductCategoryRepository {
  async getCategoryTree(): Promise<IApiResponse<ICategoryTreeResponse>> {
    const response = await apiClient.get<IApiResponse<ICategoryTreeResponse>>(
      API_ROUTES.PRODUCT_CATEGORIES.TREE,
    );
    return response;
  }
}
