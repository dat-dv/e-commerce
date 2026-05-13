import { TProduct } from "../../products/types/products.model";

export interface THomepageSectionCategory {
  id: string;
  slug: string;
  level: number;
  order: number;
  name?: string;
}

export interface TBrand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  banner_url?: string;
  description?: string;
  story?: string;
  product_count?: number;
}

export interface THomepageSection {
  category: {
    id: string;
    title: string;
    type: string;
    slug?: string;
    categories?: THomepageSectionCategory[];
  };
  data: TProduct[];
  brands?: TBrand[];
}

export interface TGetHomepageSectionsRequest {
  lang?: string;
}
