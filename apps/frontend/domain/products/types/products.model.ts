export interface TSkuDomain {
  id: string;
  price: string;
  unit_price: string;
  original_price?: string;
  discount_percent?: number;
  sold?: number;
  total?: number;
  image_url?: string;
  attributes?: { name: string; value: string }[];
}

export interface TBrand {
  id: string;
  slug: string;
  name: string;
  logo_url?: string;
}

export interface TProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  image_url?: string;
  skus: TSkuDomain[];
  sold_count?: number;
  rating?: number;
  brand?: TBrand;
}

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
