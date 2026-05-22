import { API_ROUTES } from "@/constants/routes";
import {
  ApiListResponse,
  ApiResponse,
  TRequest,
} from "@/utils/request/request.types";
import {
  ICategoryListResponse,
  ICategoryResponse,
  ICategoryTreeResponse,
  IGetAllCategoriesRequest,
  IGetCategoryGroupsRequest,
} from "@ecommerce/shared";
import { TCategory } from "../types/categories.model";
import { ICategoriesRepository } from "../types/categories.repository.interface";
import { CategoryMapper } from "./categories.mapper";

export class CategoriesRepository implements ICategoriesRepository {
  constructor(private request: TRequest) {}

  async getCategories(
    params?: IGetAllCategoriesRequest,
  ): Promise<ApiResponse<ApiListResponse<TCategory>>> {
    const response = await this.request.get<ICategoryListResponse>(
      API_ROUTES.PRODUCT_CATEGORIES.BASE,
      { params },
    );

    return {
      ...response,
      data: {
        items:
          response.data?.items.map((item: ICategoryResponse) =>
            CategoryMapper.toDomain(item),
          ) || [],
        meta: response.data?.meta || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    };
  }

  async getGroups(
    params?: IGetCategoryGroupsRequest,
  ): Promise<ApiResponse<ApiListResponse<TCategory>>> {
    const response = await this.request.get<ICategoryListResponse>(
      API_ROUTES.PRODUCT_CATEGORIES.GROUPS,
      { params },
    );

    return {
      ...response,
      data: {
        items:
          response.data?.items.map((item: ICategoryResponse) =>
            CategoryMapper.toDomain(item),
          ) || [],
        meta: response.data?.meta || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    };
  }

  async getTree(): Promise<ApiResponse<TCategory[]>> {
    const response = await this.request.get<ICategoryTreeResponse>(
      API_ROUTES.PRODUCT_CATEGORIES.TREE,
    );

    return {
      ...response,
      data:
        response.data?.map((item: ICategoryResponse) =>
          CategoryMapper.toDomain(item),
        ) || [],
    };
  }
}
