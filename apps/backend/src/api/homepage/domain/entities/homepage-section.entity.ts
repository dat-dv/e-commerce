// src/api/homepage/domain/entities/homepage-section.entity.ts

import { IProduct } from 'src/api/products/domain/entities/product.entity';
import { IProductCategory } from 'src/api/product-categories/domain/entities/product-category.entity';

export enum EHomepageSectionType {
  FLASH_SALE = 'flash_sale',
  PRODUCT_CAROUSEL = 'product_carousel',
  RECOMMENDS = 'recommends',
  RECENT_VIEW = 'recent_view',
  SUPER_DEALS = 'super_deals',
  NEW_ARRIVALS = 'new_arrivals',
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
export interface IBrand {
  id: string;
  slug: string;
  logo_url?: string | null;
  website_url?: string | null;
  is_verified: boolean;
  is_featured: boolean;
  order: number;
  name?: string; // from translation
  description?: string | null;
  product_count?: number;
}

export interface IHomepageSectionResponse {
  category: {
    id: string;
    title: string;
    type: EHomepageSectionType;
    categories?: IProductCategory[];
  };
  data: IProduct[];
  brands?: IBrand[]; // populated only when type === TOP_BRANDS
}
