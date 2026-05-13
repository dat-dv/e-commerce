import { API_ROUTES } from "@/constants/routes";
import {
  ApiListResponse,
  ApiResponse,
  TRequest,
} from "@/utils/request/request.types";
import { TCategory } from "../types/categories.model";
import { ICategoriesRepository } from "../types/categories.repository.interface";
import { CategoryMapper } from "./categories.mapper";
import { IProductCategory } from "@ecommerce/shared";

export class CategoriesRepository implements ICategoriesRepository {
  constructor(private request: TRequest) {}

  async getCategories(params?: {
    page?: number;
    limit?: number;
    level?: number;
  }): Promise<ApiResponse<ApiListResponse<TCategory>>> {
    let url = API_ROUTES.PRODUCT_CATEGORIES.BASE;
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.level) searchParams.append("level", params.level.toString());
      url += `?${searchParams.toString()}`;
    }

    const response =
      await this.request.get<ApiListResponse<IProductCategory>>(url);

    return {
      ...response,
      data: {
        items:
          response.data?.items.map((item) => CategoryMapper.toDomain(item)) ||
          [],
        meta: response.data?.meta || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    };
  }

  async getGroups(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<TCategory[]>> {
    let url = API_ROUTES.PRODUCT_CATEGORIES.GROUPS;
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      url += `?${searchParams.toString()}`;
    }

    const response = await this.request.get<IProductCategory[]>(url);

    return {
      ...response,
      data: response.data?.map((item) => CategoryMapper.toDomain(item)) || [],
    };
  }

  async getTree(): Promise<ApiResponse<TCategory[]>> {
    const response = await this.request.get<IProductCategory[]>(
      API_ROUTES.PRODUCT_CATEGORIES.TREE,
    );

    return {
      ...response,
      data: response.data?.map((item) => CategoryMapper.toDomain(item)) || [],
    };
  }
}
