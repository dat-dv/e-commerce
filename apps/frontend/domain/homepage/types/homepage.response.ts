import { IProduct, ISku } from "@ecommerce/shared";

export interface IHomepageSku extends ISku {
  sale_price?: number;
  sold?: number;
  total?: number;
}

export interface IHomepageProduct extends Omit<IProduct, "skus"> {
  skus: IHomepageSku[];
}

export interface IBrandResponse {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  product_count?: number;
}

export interface IHomepageSectionResponse {
  category: {
    id: string;
    title: string;
    type: string;
    slug?: string;
    categories?: {
      id: string;
      slug: string;
      level: number;
      order: number;
      translations?: {
        name: string;
      }[];
    }[];
  };
  data: IHomepageProduct[];
  brands?: IBrandResponse[];
}
