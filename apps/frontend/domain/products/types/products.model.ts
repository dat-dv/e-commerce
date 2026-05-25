export interface TSkuAttributeValue {
  skuId: string;
  attributeValueId: string;
  attributeValue?: {
    id: string;
    attributeId: string;
    value: string;
    attribute?: {
      id: string;
      name: string;
    } | null;
  } | null;
}

export interface TFlashSale {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  timeSlotId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TFlashSaleProductRelation {
  id: string;
  flashSaleId: string;
  skuId: string;
  salePrice: number;
  stock: number;
  soldCount: number;
  orderLimit?: number;
  flashSale?: TFlashSale | null;
}

export interface TSkuDomain {
  id: string;
  productId: string;
  skuCode: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  imageUrl?: string;
  attributes?: { name: string; value: string }[];
  sold?: number;
  total?: number;
  stock?: number;
  flashSaleStart?: string;
  flashSaleEnd?: string;
  unitPrice: string;
  flashSales?: TFlashSaleProductRelation[] | null;
  skuAttributeValues?: TSkuAttributeValue[] | null;
  product?: TProduct | null;
}

export interface TImage {
  id: string;
  url: string;
  publicId: string;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  bytes?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TBrandTranslation {
  id: string;
  brandId: string;
  languageId: string;
  name: string;
  description?: string | null;
  story?: string | null;
}

export interface TBrand {
  id: string;
  slug: string;
  logoId?: string | null;
  bannerId?: string | null;
  logoUrl?: string;
  bannerUrl?: string;
  websiteUrl?: string | null;
  foundedYear?: number | null;
  headquarters?: string | null;
  isVerified?: boolean;
  isFeatured?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  description?: string;
  logo?: TImage | null;
  banner?: TImage | null;
  translations?: TBrandTranslation[] | null;
  productCount?: number;
  storyEn?: string;
  story?: string | null;
}

export interface TProductCategoryTranslation {
  id: string;
  categoryId: string;
  languageId: string;
  name: string;
  description?: string | null;
}

export interface TProductCategory {
  id: string;
  slug: string;
  parentId?: string | null;
  imageId?: string | null;
  level?: number;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  description?: string | null;
  translations?: TProductCategoryTranslation[] | null;
}

export interface TProductCategoryMapping {
  productId: string;
  categoryId: string;
  category?: TProductCategory | null;
}

export interface TProductTranslation {
  id: string;
  productId: string;
  languageId: string;
  name: string;
  description?: string | null;
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
  brand?: TBrand | null;
  isFavorited?: boolean;
  sellerId?: string | null;
  brandId?: string | null;
  status?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  basePrice?: number;
  thumbnailId?: string | null;
  thumbnail?: TImage | null;
  categories?: TProductCategoryMapping[] | null;
  translations?: TProductTranslation[] | null;
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
