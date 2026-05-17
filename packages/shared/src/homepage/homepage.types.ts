import type { FeaturedCategory } from "../generate/browser";
import type { ICategoryResponse } from "../product-category/product-category.response";

export enum EHomepageSectionType {
  FLASH_SALE = "flash_sale",
  PRODUCT_CAROUSEL = "product_carousel",
}

export interface IHomepageFeaturedCategory extends Omit<FeaturedCategory, "created_at" | "updated_at"> {
  created_at: Date | string;
  updated_at: Date | string;
  category?: ICategoryResponse;
}

export interface IHomepageSection {
  id: string;
  type: EHomepageSectionType;
  order: number;
  is_enabled: boolean;
  require_login: boolean;
  created_at: Date | string;
  updated_at: Date | string;
  categories?: ICategoryResponse[];
  translations?: {
    title: string;
  }[];
}
