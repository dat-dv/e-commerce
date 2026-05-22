import { TCategory } from "@/domain/categories/types/categories.model";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { TProduct } from "@/domain/products/types/products.model";
import { ApiListResponse, ApiResponse } from "@/utils/request/request.types";
import {
  IGetBrandListRequest,
  IGetBrandProductsRequest,
} from "@ecommerce/shared";

export interface IBrandsRepository {
  getBrandList(
    query: IGetBrandListRequest,
  ): Promise<ApiResponse<ApiListResponse<TBrand>>>;

  getBrandBySlug(slug: string): Promise<ApiResponse<TBrand | undefined>>;

  getBrandProducts(
    slug: string,
    query: IGetBrandProductsRequest,
  ): Promise<ApiResponse<ApiListResponse<TProduct>>>;

  getBrandCategoryTree(slug: string): Promise<ApiResponse<TCategory[]>>;
}
