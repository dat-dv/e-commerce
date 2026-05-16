export interface TSkuDomain {
  id: string;
  price: number;
  unitPrice: string;
  originalPrice?: number;
  discountPercent?: number;
  imageUrl?: string;
  attributes?: { name: string; value: string }[];
  sold?: number;
  total?: number;
  stock?: number;
  flashSaleStart?: string;
  flashSaleEnd?: string;
}

export interface TBrand {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  description?: string;
}

export interface TProduct {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category: string;
  imageUrl?: string;
  skus: TSkuDomain[];
  soldCount?: number;
  reviewCount?: number;
  rating?: number;
  brand?: TBrand;
}

export type TFlashSaleProduct = TProduct;

export interface TReview {
  id: string;
  productId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  rating: number;
  comment?: string;
  images?: string[];
  createdAt: string;
}
