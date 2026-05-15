import type { ProductCategory } from "../generate/browser";
import type { IPaginatedResult } from "../paginate";

export type ICategoryResponse = ProductCategory;

export type ICategoryListResponse = IPaginatedResult<ProductCategory>;

export type ICategoryTreeResponse = ProductCategory[];
