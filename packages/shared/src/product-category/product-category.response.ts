import { ProductCategory, IPaginatedResult } from "../index";

export type ICategoryResponse = ProductCategory;

export type ICategoryListResponse = IPaginatedResult<ProductCategory>;

export type ICategoryTreeResponse = ProductCategory[];
