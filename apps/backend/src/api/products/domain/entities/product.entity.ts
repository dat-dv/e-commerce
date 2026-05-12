import { IImage } from 'src/api/upload/domain/entities/image.entity';

export enum EProductStatus {
  DRAFT = 0,
  ACTIVE = 1,
  OUT_OF_STOCK = 2,
}

export interface IProductTranslation {
  language_id: string;
  name: string;
  description?: string | null;
}

export interface IAttribute {
  id: string;
  name: string;
}

export interface IAttributeValue {
  id: string;
  value: string;
  attribute?: IAttribute;
}

export interface ISkuAttributeValue {
  attribute_value?: IAttributeValue;
}

export interface ISkuFlashSale {
  id: string;
  flash_sale_id: string;
  sku_id: string;
  sale_price: number;
  stock: number;
  sold_count: number;
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

export interface IProduct {
  id: string;
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
}

export interface IProductCategory {
  id: string;
  name: string;
}

export interface IProductBrand {
  id: string;
  name: string;
}
