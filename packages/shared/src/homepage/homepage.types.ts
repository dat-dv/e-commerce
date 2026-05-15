import { HomepageSection, HomepageSectionTranslation, ProductCategory } from "../index";

export enum EHomepageSectionType {
  FLASH_SALE = "flash_sale",
  PRODUCT_CAROUSEL = "product_carousel",
  RECOMMENDS = "recommends",
  RECENT_VIEW = "recent_view",
}

export interface IHomepageSection extends Omit<HomepageSection, "created_at" | "updated_at"> {
  created_at: Date | string;
  updated_at: Date | string;
  categories?: ProductCategory[];
  translations?: HomepageSectionTranslation[];
}
