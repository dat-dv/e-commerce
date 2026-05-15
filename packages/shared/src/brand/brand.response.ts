import type { Brand } from "../generate/browser";
import type { IProductResponse } from "../product/product.response";
import type { IPaginatedResult } from "../paginate";

export type IBrandResponse = Brand;

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
