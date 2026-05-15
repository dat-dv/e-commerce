import { Product, IPaginatedResult } from "../index";

export type IProductResponse = Product;

export type IProductDetailResponse = Product;

export type IProductListResponse = IPaginatedResult<Product>;
