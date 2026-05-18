import { API_ROUTES } from "@/constants/routes";
import {
  ApiResponse,
  TRequest,
  ApiListResponse,
  ApiPaginatedResponse,
} from "@/utils/request/request.types";
import {
  TProduct,
  TReview,
  TGetProductsRequest,
  TGetProductReviewsRequest,
  TCreateReviewRequest,
} from "../types/products.model";
import { IProductsRepository } from "../types/products.repository";
import { IProductResponse, IReviewResponse } from "@ecommerce/shared";
import { ProductMapper } from "./products.mapper";
import { ReviewMapper } from "./reviews.mapper";
import { mapPaginatedData } from "@/utils/request/pagination";

export class ProductsRepository implements IProductsRepository {
  constructor(private request: TRequest) {}

  async getRecommended(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<TProduct>> {
    const response = await this.request.get<ApiListResponse<IProductResponse>>(
      API_ROUTES.PRODUCTS.RECOMMENDED,
      { params },
    );
    return {
      ...response,
      data: mapPaginatedData(response.data, ProductMapper.toDomain, params),
    };
  }

  async getBasedOnInterest(): Promise<ApiResponse<TProduct[]>> {
    const response = await this.request.get<IProductResponse[]>(
      API_ROUTES.PRODUCTS.BASED_ON_INTEREST,
    );
    return {
      ...response,
      data: response.data?.map((item) => ProductMapper.toDomain(item)) || [],
    };
  }

  async getRecentlyViewed(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<TProduct>> {
    const response = await this.request.get<ApiListResponse<IProductResponse>>(
      API_ROUTES.PRODUCTS.RECENTLY_VIEWED,
      { params },
    );
    return {
      ...response,
      data: mapPaginatedData(response.data, ProductMapper.toDomain, params),
    };
  }

  async getFlashSale(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiPaginatedResponse<TProduct>> {
    const response = await this.request.get<{
      items: IProductResponse[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(API_ROUTES.PRODUCTS.FLASH_SALE, { params });
    return {
      ...response,
      data: mapPaginatedData(response.data, ProductMapper.toDomain, {
        page: params?.page,
        limit: params?.limit || 12,
      }),
    };
  }

  async getProductBySlug(slug: string): Promise<ApiResponse<TProduct | null>> {
    const response = await this.request.get<IProductResponse>(
      API_ROUTES.PRODUCTS.DETAIL_BY_SLUG(slug),
    );
    return {
      ...response,
      data: response.data ? ProductMapper.toDomain(response.data) : null,
    };
  }

  async getProducts(
    params?: TGetProductsRequest,
  ): Promise<ApiPaginatedResponse<TProduct>> {
    const response = await this.request.get<{
      items: IProductResponse[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`${API_ROUTES.PRODUCTS.BASE}`, { params });

    return {
      ...response,
      data: mapPaginatedData(response.data, ProductMapper.toDomain, params),
    };
  }

  async getProductReviews(
    id: string,
    params: TGetProductReviewsRequest = {},
  ): Promise<ApiPaginatedResponse<TReview>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const response = await this.request.get<ApiListResponse<IReviewResponse>>(
      API_ROUTES.PRODUCTS.REVIEWS(id),
      { params: { ...params, page, limit } },
    );

    return {
      ...response,
      data: mapPaginatedData(response.data, ReviewMapper.toDomain, {
        page,
        limit,
      }),
    };
  }

  async createReview(
    data: TCreateReviewRequest,
  ): Promise<ApiResponse<TReview>> {
    const response = await this.request.post<IReviewResponse>(
      API_ROUTES.REVIEWS.BASE,
      {
        product_id: data.productId,
        sku_id: data.skuId,
        rating: data.rating,
        comment: data.comment,
        images: data.images,
      },
    );

    return {
      ...response,
      data: ReviewMapper.toDomain(response.data),
    };
  }

  async getSimilarProducts(
    id: string,
    limit = 4,
  ): Promise<ApiResponse<TProduct[]>> {
    const response = await this.request.get<IProductResponse[]>(
      API_ROUTES.PRODUCTS.SIMILAR(id),
      { params: { limit } },
    );
    return {
      ...response,
      data: response.data?.map((item) => ProductMapper.toDomain(item)) || [],
    };
  }
}
