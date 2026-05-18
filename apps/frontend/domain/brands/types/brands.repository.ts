import { ApiResponse, ApiListResponse } from "@/utils/request/request.types";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { TProduct } from "@/domain/products/types/products.model";
import { TCategory } from "@/domain/categories/types/categories.model";

export interface IBrandsRepository {
  getTopBrands(
    page?: number,
    limit?: number,
  ): Promise<ApiResponse<ApiListResponse<TBrand>>>;

  getBrandBySlug(slug: string): Promise<ApiResponse<TBrand | undefined>>;

  getBrandProducts(
    slug: string,
    page?: number,
    limit?: number,
    search?: string,
  ): Promise<ApiResponse<ApiListResponse<TProduct>>>;

  getBrandCategoryTree(slug: string): Promise<ApiResponse<TCategory[]>>;
}
