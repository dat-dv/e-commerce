import { API_ROUTES } from "@/constants/routes";
import { ApiResponse, TRequest } from "@/utils/request/request.types";
import { ICategory } from "../types/categories.model";
import { ICategoryResponse } from "../types/categories.response";
import { ICategoriesRepository } from "../entities/categories.repository.interface";
import { CategoryMapper } from "./categories.mapper";

export class CategoriesRepository implements ICategoriesRepository {
  constructor(private request: TRequest) {}

  async getCategories(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<ICategory[]>> {
    let url = API_ROUTES.PRODUCT_CATEGORIES;
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      url += `?${searchParams.toString()}`;
    }

    const response = await this.request.get<ICategoryResponse[]>(url);

    return {
      ...response,
      data: response.data?.map((item) => CategoryMapper.toDomain(item)) || [],
    };
  }
}
