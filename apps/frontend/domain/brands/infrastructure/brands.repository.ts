import { API_ROUTES } from "@/constants/routes";
import { TCategory } from "@/domain/categories/types/categories.model";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { TProduct } from "@/domain/products/types/products.model";
import {
  ApiListResponse,
  ApiResponse,
  TRequest,
} from "@/utils/request/request.types";
import {
  IBrandProductsResponse,
  IBrandResponse,
  ICategoryResponse,
  IGetBrandListRequest,
} from "@ecommerce/shared";
import { CategoryMapper } from "../../categories/infrastructure/categories.mapper";
import { ProductMapper } from "../../products/infrastructure/products.mapper";
import { IBrandsRepository } from "../types/brands.repository";
import { BrandMapper } from "./brands.mapper";

export class BrandsRepository implements IBrandsRepository {
  constructor(private request: TRequest) {}

  async getBrandList(
    query: IGetBrandListRequest,
  ): Promise<ApiResponse<ApiListResponse<TBrand>>> {
    const response = await this.request.get<ApiListResponse<IBrandResponse>>(
      `${API_ROUTES.BRAND.TOP}`,
      { params: query },
    );
    return {
      ...response,
      data: {
        items: response?.data?.items?.map((item) => BrandMapper.toDomain(item)),
        meta: response.data?.meta,
      },
    };
  }

  async getBrandBySlug(slug: string): Promise<ApiResponse<TBrand | undefined>> {
    const response = await this.request.get<IBrandResponse>(
      API_ROUTES.BRAND.DETAIL(slug),
    );

    return {
      ...response,
      data: response.data ? BrandMapper.toDomain(response.data) : undefined,
    };
  }

  async getBrandProducts(
    slug: string,
    page = 1,
    limit = 20,
    search?: string,
    category?: string,
  ): Promise<ApiResponse<ApiListResponse<TProduct>>> {
    const response = await this.request.get<IBrandProductsResponse>(
      `${API_ROUTES.BRAND.DETAIL(slug)}/products`,
      {
        params: {
          page,
          limit,
          search: search ?? undefined,
          category: category ?? undefined,
        },
      },
    );

    return {
      ...response,
      data: response.data
        ? {
            items: (response.data.products || []).map((item) =>
              ProductMapper.toDomain(item),
            ),
            meta: response.data.meta,
          }
        : {
            items: [],
            meta: { total: 0, page, limit, totalPages: 0 },
          },
    };
  }

  async getBrandCategoryTree(slug: string): Promise<ApiResponse<TCategory[]>> {
    const response = await this.request.get<ICategoryResponse[]>(
      `${API_ROUTES.BRAND.DETAIL(slug)}/categories`,
    );

    return {
      ...response,
      data: (response.data || []).map((item) => CategoryMapper.toDomain(item)),
    };
  }
}
