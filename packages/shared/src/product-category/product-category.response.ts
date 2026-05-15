import { IProductCategory } from "./product-category.types";


export type ICategoryResponse = IProductCategory;

export type ICategoryTreeResponse = IProductCategory[];

export interface ICategoryListResponse {
  data: IProductCategory[];
  total: number;
  page: number;
  limit: number;
}
