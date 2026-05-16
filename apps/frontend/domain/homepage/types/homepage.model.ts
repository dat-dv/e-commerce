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
  logoUrl?: string;
  bannerUrl?: string;
  description?: string;
  story?: string;
  productCount?: number;
}

export interface THomepageSection {
  section: {
    id: string;
    title: string;
    type: string;
    categories?: THomepageSectionCategory[];
  };
  data: TProduct[];
  brands?: TBrand[];
}

export interface TGetHomepageSectionsRequest {
  lang?: string;
}
