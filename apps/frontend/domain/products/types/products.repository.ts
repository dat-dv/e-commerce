import { ApiResponse, ApiListResponse } from "@/utils/request/request.types";
import { IProduct } from "./products.model";

export interface IProductsRepository {
  getRecommended(): Promise<ApiResponse<IProduct[]>>;
  getBasedOnInterest(): Promise<ApiResponse<IProduct[]>>;
  getRecentlyViewed(): Promise<ApiResponse<IProduct[]>>;
  getFlashSale(): Promise<ApiResponse<IProduct[]>>;
  getProductById(
    id: string,
    lang?: string,
  ): Promise<ApiResponse<IProduct | null>>;
  getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: string;
    brand_id?: string;
    min_price?: number;
    max_price?: number;
    attribute_value_ids?: string[];
    sort?: string;
    languageCode?: string;
  }): Promise<ApiResponse<ApiListResponse<IProduct>>>;
}
