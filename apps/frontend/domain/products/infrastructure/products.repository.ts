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
} from "../types/products.model";
import { IProductsRepository } from "../types/products.repository";
import { IProductResponse, IReviewResponse } from "@ecommerce/shared";
import { ProductMapper } from "./products.mapper";
import { ReviewMapper } from "./reviews.mapper";

export class ProductsRepository implements IProductsRepository {
  constructor(private request: TRequest) {}

  async getRecommended(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<TProduct[]>> {
    const response = await this.request.get<IProductResponse[]>(
      API_ROUTES.PRODUCTS.RECOMMENDED,
      { params },
    );
    return {
      ...response,
      data: response.data?.map((item) => ProductMapper.toDomain(item)) || [],
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
  }): Promise<ApiResponse<TProduct[]>> {
    const response = await this.request.get<IProductResponse[]>(
      API_ROUTES.PRODUCTS.RECENTLY_VIEWED,
      { params },
    );
    return {
      ...response,
      data: response.data?.map((item) => ProductMapper.toDomain(item)) || [],
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
      data: response.data
        ? {
            items: response.data.items.map((item) =>
              ProductMapper.toDomain(item),
            ),
            meta: response.data.meta,
          }
        : {
            items: [],
            meta: {
              total: 0,
              page: params?.page || 1,
              limit: params?.limit || 12,
              totalPages: 0,
            },
          },
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
      data: response.data
        ? {
            items: response.data.items.map((item) =>
              ProductMapper.toDomain(item),
            ),
            meta: response.data.meta,
          }
        : {
            items: [],
            meta: {
              total: 0,
              page: params?.page || 1,
              limit: params?.limit || 10,
              totalPages: 0,
            },
          },
    };
  }

  async getProductReviews(
    id: string,
    page = 1,
    limit = 10,
  ): Promise<ApiPaginatedResponse<TReview>> {
    const response = await this.request.get<ApiListResponse<IReviewResponse>>(
      API_ROUTES.PRODUCTS.REVIEWS(id),
      { params: { page, limit } },
    );

    return {
      ...response,
      data: response.data
        ? {
            items: response.data.items.map((item) =>
              ReviewMapper.toDomain(item),
            ),
            meta: response.data.meta,
          }
        : undefined,
    } as ApiPaginatedResponse<TReview>;
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
