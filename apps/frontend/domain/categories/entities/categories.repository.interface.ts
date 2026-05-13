import { ApiResponse, ApiListResponse } from "@/utils/request/request.types";
import { ICategory } from "../types/categories.model";

export interface ICategoriesRepository {
  getCategories(params?: {
    page?: number;
    limit?: number;
    level?: number;
  }): Promise<ApiResponse<ApiListResponse<ICategory>>>;
  getGroups(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<ICategory[]>>;
  getTree(): Promise<ApiResponse<ICategory[]>>;
}
