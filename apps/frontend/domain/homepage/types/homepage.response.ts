import {
  IProductResponse,
  ISkuResponse,
} from "../../products/types/products.response";

export interface IHomepageSku extends ISkuResponse {
  sale_price?: number;
  sold?: number;
  total?: number;
}

export interface IHomepageProduct extends Omit<IProductResponse, "skus"> {
  skus: IHomepageSku[];
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
}
