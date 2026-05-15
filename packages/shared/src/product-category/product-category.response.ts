import type { ProductCategory, ProductCategoryTranslation } from "../generate/browser";
import type { IPaginatedResult } from "../paginate";

export interface ICategoryResponse extends ProductCategory {
  translations?: ProductCategoryTranslation[];
  children?: ICategoryResponse[];
}

export type ICategoryListResponse = IPaginatedResult<ICategoryResponse>;

export type ICategoryTreeResponse = ICategoryResponse[];
