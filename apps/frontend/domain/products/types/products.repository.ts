import { ApiResponse, ApiListResponse } from "@/utils/request/request.types";
import { TProduct } from "./products.model";

export interface IProductsRepository {
  getRecommended(): Promise<ApiResponse<TProduct[]>>;
  getBasedOnInterest(): Promise<ApiResponse<TProduct[]>>;
  getRecentlyViewed(): Promise<ApiResponse<TProduct[]>>;
  getFlashSale(): Promise<ApiResponse<TProduct[]>>;
  getProductById(
    id: string,
    lang?: string,
  ): Promise<ApiResponse<TProduct | null>>;
  getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: string;
    category_slug?: string;
    brand_id?: string;
    min_price?: number;
    max_price?: number;
    attribute_value_ids?: string[];
    sort?: string;
    languageCode?: string;
  }): Promise<ApiResponse<ApiListResponse<TProduct>>>;
}
