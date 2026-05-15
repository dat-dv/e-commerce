import { IBrand } from "./brand.types";
import { IProduct } from "../product/product.types";


export type IBrandResponse = IBrand;

export interface IBrandListResponse {
  data: IBrand[];
  total: number;
  page: number;
  limit: number;
}

export interface IBrandProductsResponse {
  brand: IBrand;
  products: IProduct[];
  total: number;
  page: number;
  limit: number;
}
