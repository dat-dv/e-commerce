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
  isFavorited?: boolean;
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

export type TReviewSort = "newest" | "oldest" | "rating_desc" | "rating_asc";

export type TGetProductReviewsRequest = {
  page?: number;
  limit?: number;
  rating?: number;
  has_images?: boolean;
  sort?: TReviewSort;
};

export type TCreateReviewRequest = {
  productId: string;
  skuId: string;
  rating: number;
  comment?: string;
  images?: string[];
};

export type TGetProductsRequest = {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
  category_slug?: string;
  brand_id?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
  attribute_value_ids?: string[];
  sort?: string;
  languageCode?: string;
};
