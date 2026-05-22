import {
  ApiPaginatedResponse,
  ApiResponse,
} from "@/utils/request/request.types";
import { IGetRecentlyViewedRequest } from "@ecommerce/shared";
import {
  TCreateReviewRequest,
  TGetProductReviewsRequest,
  TGetProductsRequest,
  TProduct,
  TReview,
} from "./products.model";

export interface IProductsRepository {
  getRecommended(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<TProduct>>;

  getBasedOnInterest(): Promise<ApiResponse<TProduct[]>>;

  getRecentlyViewed(
    query?: IGetRecentlyViewedRequest,
  ): Promise<ApiPaginatedResponse<TProduct>>;

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
