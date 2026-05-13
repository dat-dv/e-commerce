export interface TSkuDomain {
  id: string;
  price: string;
  original_price?: string;
  discount_percent?: number;
  sold?: number;
  total?: number;
  image_url?: string;
}

export interface TProduct {
  id: string;
  name: string;
  category: string;
  image_url?: string;
  skus: TSkuDomain[];
}
