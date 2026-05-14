import { IImage } from "./image";
import { IProductCategory } from "./product-category";
import { IBrand } from "./brand";

export enum EProductStatus {
  DRAFT = 0,
  ACTIVE = 1,
  OUT_OF_STOCK = 2,
}

export enum EProductSort {
  DEFAULT = 0,
  PRICE_ASC = 1,
  PRICE_DESC = 2,
  BUY_MOST = 3,
  BUY_LESS = 4,
}

export interface IProductTranslation {
  language_id: string;
  name: string;
  description?: string | null;
}

export interface IAttributeTranslation {
  language_id: string;
  name: string;
}

export interface IAttribute {
  id: string;
  name: string;
  translations?: IAttributeTranslation[];
}

export interface IAttributeValueTranslation {
  language_id: string;
  value: string;
}

export interface IAttributeValue {
  id: string;
  value: string;
  attribute?: IAttribute;
  translations?: IAttributeValueTranslation[];
}

export interface ISkuAttributeValue {
  attribute_value?: IAttributeValue;
}

import { IFlashSale } from "./flash-sale";

export interface ISkuFlashSale {
  id: string;
  flash_sale_id: string;
  sku_id: string;
  sale_price: number;
  stock: number;
  sold_count: number;
  flash_sale?: IFlashSale;
}

export interface ISku {
  id: string;
  product_id: string;
  sku_code: string;
  price: number;
  original_price?: number | null;
  stock: number;
  image_url?: string | null;
  sku_attribute_values?: ISkuAttributeValue[];
  flash_sales?: ISkuFlashSale[]; // Quan hệ từ FlashSaleProduct
  product?: IProduct; // Quan hệ ngược về Product
}

export interface IProductCategoryMapping {
  product_id: string;
  category_id: string;
  category?: IProductCategory;
}

export interface IProduct {
  id: string;
  slug?: string | null;
  seller_id?: string | null;
  category_id?: string | null;
  brand_id?: string | null;
  status: EProductStatus;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;

  translations?: IProductTranslation[];
  skus?: ISku[];
  thumbnail?: IImage | null;
  brand?: IBrand | null;
  categories?: IProductCategoryMapping[];
  rating?: number;
  sold_count?: number;
  review_count?: number;
}

export interface IReview {
  id: string;
  product_id: string;
  sku_id: string;
  user_id: string;
  rating: number;
  comment?: string | null;
  images?: unknown;
  created_at: Date;
  user?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  };
  sku?: ISku;
}
