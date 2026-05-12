import { IImage } from 'src/api/upload/domain/entities/image.entity';

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

export interface ISku {
  id: string;
  sku_code: string;
  price: number;
  stock: number;
  image_url?: string | null;
  sku_attribute_values?: ISkuAttributeValue[];
}

export interface IProduct {
  id: string;
  seller_id?: string | null;
  category_id?: string | null;
  brand_id?: string | null;
  status: string;
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
