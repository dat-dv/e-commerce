import {
  ApiResponse,
  ApiPaginatedResponse,
} from "@/utils/request/request.types";
import { TProduct, TReview, TGetProductsRequest } from "./products.model";

export interface IProductsRepository {
  getRecommended(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<TProduct[]>>;

  getBasedOnInterest(): Promise<ApiResponse<TProduct[]>>;

  getRecentlyViewed(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<TProduct[]>>;

  getFlashSale(): Promise<ApiResponse<TProduct[]>>;

  getProductBySlug(slug: string): Promise<ApiResponse<TProduct | null>>;

  getProducts(
    params?: TGetProductsRequest,
  ): Promise<ApiPaginatedResponse<TProduct>>;

  getProductReviews(
    id: string,
    page?: number,
    limit?: number,
  ): Promise<ApiPaginatedResponse<TReview>>;

  getSimilarProducts(
    id: string,
    limit?: number,
  ): Promise<ApiResponse<TProduct[]>>;
}
