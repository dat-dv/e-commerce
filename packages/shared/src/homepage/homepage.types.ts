import type { HomepageSection, HomepageSectionTranslation } from "../generate/browser";
import type { ICategoryResponse } from "../product-category/product-category.response";

export enum EHomepageSectionType {
  FLASH_SALE = "flash_sale",
  PRODUCT_CAROUSEL = "product_carousel",
  RECOMMENDS = "recommends",
  RECENT_VIEW = "recent_view",
}

export interface IHomepageSection extends Omit<HomepageSection, "created_at" | "updated_at"> {
  created_at: Date | string;
  updated_at: Date | string;
  categories?: ICategoryResponse[];
  translations?: HomepageSectionTranslation[];
}
