import { ApiListResponse, ApiResponse } from "@/utils/request/request.types";
import {
  IGetAllCategoriesRequest,
  IGetCategoryGroupsRequest,
} from "@ecommerce/shared";
import { TCategory } from "./categories.model";

export interface ICategoriesRepository {
  getCategories(
    query?: IGetAllCategoriesRequest,
  ): Promise<ApiResponse<ApiListResponse<TCategory>>>;
  getGroups(
    query?: IGetCategoryGroupsRequest,
  ): Promise<ApiResponse<ApiListResponse<TCategory>>>;
  getTree(): Promise<ApiResponse<TCategory[]>>;
}
