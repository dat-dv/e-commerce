export interface IProductTranslationResponse {
  language_id: string;
  name: string;
  description?: string | null;
}

export interface ISkuResponse {
  id: string;
  sku_code: string;
  price: number;
  original_price?: number | null;
  stock: number;
  image_url?: string | null;
  flash_sales?: IFlashSaleProductResponse[];
}

export interface IFlashSaleProductResponse {
  id: string;
  flash_sale_id: string;
  sku_id: string;
  sale_price: number;
  stock: number;
  sold_count: number;
  order_limit: number;
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
