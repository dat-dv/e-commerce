import { IProduct } from "../../products/types/products.model";

export interface IHomepageSectionCategory {
  id: string;
  slug: string;
  level: number;
  order: number;
  name?: string;
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
}

export interface IGetHomepageSectionsRequest {
  lang?: string;
}
