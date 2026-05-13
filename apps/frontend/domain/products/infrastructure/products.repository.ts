import { API_ROUTES } from "@/constants/routes";
import {
  ApiResponse,
  TRequest,
  ApiListResponse,
} from "@/utils/request/request.types";
import { TProduct } from "../types/products.model";
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

  async getProductById(
    id: string,
    lang = "vi",
  ): Promise<ApiResponse<TProduct | null>> {
    const response = await this.request.get<IProduct>(
      `${API_ROUTES.PRODUCTS.BASE}/${id}`,
      { params: { lang } },
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
            items: Array.isArray(response.data)
              ? response.data.map((item) => ProductMapper.toDomain(item))
              : (response.data.items || []).map((item) =>
                  ProductMapper.toDomain(item),
                ),
            meta: Array.isArray(response.data)
              ? {
                  total: response.data.length,
                  page: 1,
                  limit: response.data.length,
                  totalPages: 1,
                }
              : response.data.meta,
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
}
