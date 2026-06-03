import type { IUpdateProductRequest } from "@ecommerce/shared";

export interface IAdminProductImage {
  id: string;
  url: string;
  publicId?: string | null;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  bytes?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAdminProductTranslation {
  id?: string;
  productId?: string;
  languageId: string;
  name: string;
  description?: string | null;
}

export interface IAdminBrandTranslation {
  id?: string;
  brandId?: string;
  languageId?: string;
  name: string;
  description?: string | null;
}

export interface IAdminBrand {
  id: string;
  slug: string;
  logoId?: string | null;
  bannerId?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  websiteUrl?: string | null;
  foundedYear?: number | null;
  headquarters?: string | null;
  isVerified?: boolean;
  isFeatured?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  translations?: IAdminBrandTranslation[];
  logo?: IAdminProductImage | null;
  banner?: IAdminProductImage | null;
  productCount?: number;
  storyEn?: string;
}

export interface IAdminProductCategoryTranslation {
  id?: string;
  categoryId?: string;
  languageId?: string;
  name: string;
  description?: string | null;
}

export interface IAdminCategory {
  id: string;
  slug: string;
  parentId?: string | null;
  imageId?: string | null;
  level?: number;
  isActive?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  translations?: IAdminProductCategoryTranslation[];
  children?: IAdminCategory[];
}

export interface IAdminProductCategoryMapping {
  productId: string;
  categoryId: string;
  category?: IAdminCategory;
}

export interface IAdminAttribute {
  id: string;
  name: string;
  values?: IAdminAttributeValue[];
}

export interface IAdminAttributeValue {
  id: string;
  attributeId: string;
  value: string;
  attribute?: IAdminAttribute;
}

export interface IAdminSkuAttributeValue {
  skuId: string;
  attributeValueId: string;
  attributeValue?: IAdminAttributeValue;
}

export interface IAdminFlashSale {
  id: string;
  name: string;
  startTime?: string;
  endTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAdminFlashSaleProduct {
  id?: string;
  flashSaleId?: string;
  skuId?: string;
  salePrice?: number;
  stock?: number;
  soldCount?: number;
  flashSale?: IAdminFlashSale;
}

export interface IAdminSku {
  id: string;
  productId: string;
  skuCode: string;
  price: number;
  originalPrice?: number | null;
  stock: number;
  imageUrl?: string | null;
  unitPrice?: string | null;
  flashSales?: IAdminFlashSaleProduct[];
  skuAttributeValues?: IAdminSkuAttributeValue[];
  product?: IAdminProduct;
}

export interface IAdminProduct {
  id: string;
  slug: string;
  sellerId?: string | null;
  brandId?: string | null;
  status: number;
  soldCount: number;
  reviewCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  basePrice: number;
  thumbnailId?: string | null;
  translations?: IAdminProductTranslation[];
  thumbnail?: IAdminProductImage | null;
  brand?: IAdminBrand | null;
  categories?: IAdminProductCategoryMapping[];
  skus?: IAdminSku[];
  isFavorited?: boolean;
}

export type IAdminUpdateProductRequest = IUpdateProductRequest;
