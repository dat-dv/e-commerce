import { EProductSort } from "./product.types";

export interface IGetProductsParams {
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

export interface IGetRecentlyViewedRequest {
  page?: number;
  limit?: number;
}
