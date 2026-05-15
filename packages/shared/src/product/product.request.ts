import { EProductSort } from "./product.types";


export interface IGetProductsRequest {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
  category_slug?: string;
  brand_id?: string;
  min_price?: number;
  max_price?: number;
  attribute_value_ids?: string[];
  sort?: EProductSort;
  languageCode?: string;
}

export interface IGetProductReviewsRequest {
  page?: number;
  limit?: number;
}
