import {
  ApiResponse,
  ApiPaginatedResponse,
} from "@/utils/request/request.types";
import {
  TProduct,
  TReview,
  TGetProductsRequest,
  TGetProductReviewsRequest,
  TCreateReviewRequest,
} from "./products.model";

export interface IProductsRepository {
  getRecommended(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<TProduct>>;

  getBasedOnInterest(): Promise<ApiResponse<TProduct[]>>;

  getRecentlyViewed(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<TProduct>>;

  getFlashSale(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<TProduct>>;

  getProductBySlug(slug: string): Promise<ApiResponse<TProduct | null>>;

  getProducts(
    params?: TGetProductsRequest,
  ): Promise<ApiPaginatedResponse<TProduct>>;

  getProductReviews(
    id: string,
    params?: TGetProductReviewsRequest,
  ): Promise<ApiPaginatedResponse<TReview>>;

  createReview(data: TCreateReviewRequest): Promise<ApiResponse<TReview>>;

  getSimilarProducts(
    id: string,
    limit?: number,
  ): Promise<ApiResponse<TProduct[]>>;
}
