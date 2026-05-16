import type { Brand, BrandTranslation, Image } from "../generate/browser";
import type { IProductResponse } from "../product/product.response";
import type { IPaginatedResult } from "../paginate";

export interface IBrandResponse extends Brand {
  translations?: BrandTranslation[];
  logo?: Image | null;
  banner?: Image | null;
  product_count?: number;
  story_en?: string;
}

export type IBrandListResponse = IPaginatedResult<IBrandResponse>;

export interface IBrandProductsResponse {
  brand: IBrandResponse;
  products: IProductResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
