import { ApiResponse, ApiListResponse } from "@/utils/request/request.types";
import { TProduct, TReview, TGetProductsRequest } from "./products.model";

export interface IProductsRepository {
  getRecommended(): Promise<ApiResponse<TProduct[]>>;
  getBasedOnInterest(): Promise<ApiResponse<TProduct[]>>;
  getRecentlyViewed(): Promise<ApiResponse<TProduct[]>>;
  getFlashSale(): Promise<ApiResponse<TProduct[]>>;
  getProductBySlug(slug: string): Promise<ApiResponse<TProduct | null>>;
  getProducts(
    params?: TGetProductsRequest,
  ): Promise<ApiResponse<ApiListResponse<TProduct>>>;

  getProductReviews(
    id: string,
    page?: number,
    limit?: number,
  ): Promise<ApiResponse<ApiListResponse<TReview>>>;

  getSimilarProducts(
    id: string,
    limit?: number,
  ): Promise<ApiResponse<TProduct[]>>;
}
