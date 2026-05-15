import { IProductCategory } from "../product-category/product-category.types";

export enum EHomepageSectionType {
  FLASH_SALE = "flash_sale",
  PRODUCT_CAROUSEL = "product_carousel",
  RECOMMENDS = "recommends",
  RECENT_VIEW = "recent_view",
  SUPER_DEALS = "super_deals",
  NEW_ARRIVALS = "new_arrivals",
}

export interface IHomepageSectionTranslation {
  id: string;
  homepage_section_id: string;
  language_id: string;
  title: string;
  language?: {
    code: string;
  };
}

export interface IHomepageSection {
  id: string;
  type: EHomepageSectionType;
  order: number;
  is_enabled: boolean;
  require_login: boolean;
  categories?: IProductCategory[];
  translations?: IHomepageSectionTranslation[];
  created_at: Date;
  updated_at: Date;
}
