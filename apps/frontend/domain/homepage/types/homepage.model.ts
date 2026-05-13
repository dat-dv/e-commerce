import { IProduct } from "../../products/types/products.model";

export interface IHomepageSectionCategory {
  id: string;
  slug: string;
  level: number;
  order: number;
  name?: string;
}

export interface IBrand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  product_count?: number;
}

export interface IHomepageSection {
  category: {
    id: string;
    title: string;
    type: string;
    slug?: string;
    categories?: IHomepageSectionCategory[];
  };
  data: IProduct[];
  brands?: IBrand[];
}

export interface IGetHomepageSectionsRequest {
  lang?: string;
}
