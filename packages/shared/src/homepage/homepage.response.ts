import { IHomepageSection, Product, Brand } from "../index";

export interface IHomepageSectionResponse {
  section: IHomepageSection;
  data: Product[];
  brands?: Brand[];
}
