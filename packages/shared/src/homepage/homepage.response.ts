import type { IHomepageSection } from "./homepage.types";
import type { IProductResponse } from "../product/product.response";
import type { IBrandResponse } from "../brand/brand.response";

export interface IHomepageSectionResponse {
  section: IHomepageSection;
  data: IProductResponse[];
  brands?: IBrandResponse[];
}
