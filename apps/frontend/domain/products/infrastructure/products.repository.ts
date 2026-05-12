import { API_ROUTES } from "@/constants/routes";
import { ApiResponse, TRequest } from "@/utils/request/request.types";
import { IProduct } from "../types/products.model";
import { IProductsRepository } from "../types/products.repository";
import { IProductResponse } from "../types/products.response";
import { ProductMapper } from "./products.mapper";

export class ProductsRepository implements IProductsRepository {
  constructor(private request: TRequest) {}

  async getRecommended(): Promise<ApiResponse<IProduct[]>> {
    const response = await this.request.get<IProductResponse[]>(
      API_ROUTES.PRODUCTS.RECOMMENDED,
    );
    return {
      ...response,
      data: response.data?.map((item) => ProductMapper.toDomain(item)) || [],
    };
  }

  async getBasedOnInterest(): Promise<ApiResponse<IProduct[]>> {
    const response = await this.request.get<IProductResponse[]>(
      API_ROUTES.PRODUCTS.BASED_ON_INTEREST,
    );
    return {
      ...response,
      data: response.data?.map((item) => ProductMapper.toDomain(item)) || [],
    };
  }

  async getRecentlyViewed(): Promise<ApiResponse<IProduct[]>> {
    const response = await this.request.get<IProductResponse[]>(
      API_ROUTES.PRODUCTS.RECENTLY_VIEWED,
    );
    return {
      ...response,
      data: response.data?.map((item) => ProductMapper.toDomain(item)) || [],
    };
  }

  async getFlashSale(): Promise<ApiResponse<IProduct[]>> {
    const response = await this.request.get<IProductResponse[]>(
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
  ): Promise<ApiResponse<IProduct | null>> {
    const response = await this.request.get<IProductResponse>(
      `${API_ROUTES.PRODUCTS.BASE}/${id}`,
      { params: { lang } },
    );
    return {
      ...response,
      data: response.data ? ProductMapper.toDomain(response.data) : null,
    };
  }
}
