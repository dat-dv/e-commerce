import { IProduct } from "../../products/types/products.model";

export interface IHomepageSection {
  category: {
    id: string;
    title: string;
    type: string;
    slug?: string;
    params?: Record<string, string>;
  };
  data: IProduct[];
}
