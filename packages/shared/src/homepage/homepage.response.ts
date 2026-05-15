import { EHomepageSectionType } from "./homepage.types";
import { IProduct } from "../product/product.types";
import { IBrand } from "../brand/brand.types";
import { IProductCategory } from "../product-category/product-category.types";


export interface IHomepageSectionResponse {
  section: {
    id: string;
    title: string;
    type: EHomepageSectionType;
    categories?: IProductCategory[];
  };
  data: IProduct[];
  brands?: IBrand[];
}
