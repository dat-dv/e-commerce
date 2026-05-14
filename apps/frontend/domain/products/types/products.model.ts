export interface TSkuDomain {
  id: string;
  price: number;
  unit_price: string;
  original_price?: number;
  discount_percent?: number;
  image_url?: string;
  attributes?: { name: string; value: string }[];
  sold?: number;
  total?: number;
  stock?: number;
  flash_sale_start?: string;
  flash_sale_end?: string;
}

export interface TBrand {
  id: string;
  slug: string;
  name: string;
  logo_url?: string;
  description?: string;
}

export interface TProduct {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category: string;
  image_url?: string;
  skus: TSkuDomain[];
  sold_count?: number;
  review_count?: number;
  rating?: number;
  brand?: TBrand;
}

export type TFlashSaleProduct = TProduct;

export interface TReview {
  id: string;
  product_id: string;
  user_id: string;
  user: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  rating: number;
  comment?: string;
  images?: string[];
  created_at: string;
}
