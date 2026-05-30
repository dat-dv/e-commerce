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

export interface IUpdateProductTranslationRequest {
  language_id: string;
  name: string;
  description?: string;
}

export interface IUpdateProductSkuRequest {
  id?: string;
  sku_code: string;
  price: number;
  original_price?: number | null;
  stock: number;
  image_url?: string | null;
  unit_price?: string | null;
  attribute_value_ids?: string[];
}

export interface IUpdateProductRequest {
  base_price?: number;
  status?: number;
  thumbnail_id?: string | null;
  brand_id?: string | null;
  category_ids?: string[];
  translations?: IUpdateProductTranslationRequest[];
  skus?: IUpdateProductSkuRequest[];
  deleted_sku_ids?: string[];
}
