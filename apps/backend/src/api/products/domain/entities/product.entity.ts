export interface IProductTranslation {
  language_id: string;
  name: string;
  description?: string | null;
}

export interface ISku {
  id: string;
  sku_code: string;
  price: number;
  stock: number;
  image_url?: string | null;
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
}
