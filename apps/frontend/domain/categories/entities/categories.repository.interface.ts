import { ApiResponse } from "@/utils/request/request.types";
import { ICategory } from "../types/categories.model";

export interface ICategoriesRepository {
  getCategories(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<ICategory[]>>;
}
