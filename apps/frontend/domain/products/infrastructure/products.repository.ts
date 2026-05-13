import { API_ROUTES } from "@/constants/routes";
import {
  ApiResponse,
  TRequest,
  ApiListResponse,
} from "@/utils/request/request.types";
import { TProduct, TReview } from "../types/products.model";
import { IProductsRepository } from "../types/products.repository";
import { IProduct } from "@ecommerce/shared";
import { ProductMapper } from "./products.mapper";

export class ProductsRepository implements IProductsRepository {
  constructor(private request: TRequest) {}

  async getRecommended(): Promise<ApiResponse<TProduct[]>> {
    const response = await this.request.get<IProduct[]>(
      API_ROUTES.PRODUCTS.RECOMMENDED,
    );
    return {
      ...response,
      data: response.data?.map((item) => ProductMapper.toDomain(item)) || [],
    };
  }

  async getBasedOnInterest(): Promise<ApiResponse<TProduct[]>> {
    const response = await this.request.get<IProduct[]>(
      API_ROUTES.PRODUCTS.BASED_ON_INTEREST,
    );
    return {
      ...response,
      data: response.data?.map((item) => ProductMapper.toDomain(item)) || [],
    };
  }

  async getRecentlyViewed(): Promise<ApiResponse<TProduct[]>> {
    const response = await this.request.get<IProduct[]>(
      API_ROUTES.PRODUCTS.RECENTLY_VIEWED,
    );
    return {
      ...response,
      data: response.data?.map((item) => ProductMapper.toDomain(item)) || [],
    };
  }

  async getFlashSale(): Promise<ApiResponse<TProduct[]>> {
    const response = await this.request.get<IProduct[]>(
      API_ROUTES.PRODUCTS.FLASH_SALE,
    );
    return {
      ...response,
      data: response.data?.map((item) => ProductMapper.toDomain(item)) || [],
    };
  }

  async getProductBySlug(slug: string): Promise<ApiResponse<TProduct | null>> {
    const response = await this.request.get<IProduct>(
      API_ROUTES.PRODUCTS.DETAIL_BY_SLUG(slug),
    );
    return {
      ...response,
      data: response.data ? ProductMapper.toDomain(response.data) : null,
    };
  }

  async getProducts(params?: {
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
  }): Promise<ApiResponse<ApiListResponse<TProduct>>> {
    const response = await this.request.get<{
      items: IProduct[];
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
  ): Promise<ApiResponse<ApiListResponse<TReview>>> {
    const response = await this.request.get<ApiListResponse<TReview>>(
      API_ROUTES.PRODUCTS.REVIEWS(id),
      { params: { page, limit } },
    );
    return response;
  }

  async getSimilarProducts(
    id: string,
    limit = 4,
  ): Promise<ApiResponse<TProduct[]>> {
    const response = await this.request.get<IProduct[]>(
      API_ROUTES.PRODUCTS.SIMILAR(id),
      { params: { limit } },
    );
    return {
      ...response,
      data: response.data?.map((item) => ProductMapper.toDomain(item)) || [],
    };
  }
}
