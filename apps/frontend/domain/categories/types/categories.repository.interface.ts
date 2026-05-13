import { ApiResponse, ApiListResponse } from "@/utils/request/request.types";
import { TCategory } from "./categories.model";

export interface ICategoriesRepository {
  getCategories(params?: {
    page?: number;
    limit?: number;
    level?: number;
  }): Promise<ApiResponse<ApiListResponse<TCategory>>>;
  getGroups(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<TCategory[]>>;
  getTree(): Promise<ApiResponse<TCategory[]>>;
}
