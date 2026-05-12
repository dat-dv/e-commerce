export interface IProductTranslationResponse {
  language_id: string;
  name: string;
  description?: string | null;
}

export interface ISkuResponse {
  id: string;
  sku_code: string;
  price: number;
  original_price?: number;
  stock: number;
  sold?: number;
  total?: number;
  image_url?: string | null;
}

export interface IProductCategoryResponse {
  id: string;
  name: string;
}

export interface IProductResponse {
  id: string;
  status: number;
  translations?: IProductTranslationResponse[];
  skus?: ISkuResponse[];
  thumbnail?: {
    url: string;
    publicId?: string;
  } | null;
  category?: IProductCategoryResponse | null;
  sale_price?: number;
  sold_count?: number;
  stock_count?: number;
}
