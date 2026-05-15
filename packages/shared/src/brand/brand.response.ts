import type { Brand, Product } from "../generate/browser";
import type { IPaginatedResult } from "../paginate";

export type IBrandResponse = Brand;

export type IBrandListResponse = IPaginatedResult<Brand>;

export interface IBrandProductsResponse {
  brand: Brand;
  products: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
