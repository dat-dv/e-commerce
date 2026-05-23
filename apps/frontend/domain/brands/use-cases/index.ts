import { appRequest } from "@/constants/app-request";
import { BrandsRepository } from "../infrastructure/brands.repository";
import { GetBrandBySlugUseCase } from "./get-brand-by-slug.use-case";
import { GetBrandCategoriesUseCase } from "./get-brand-categories.use-case";
import { GetBrandProductsUseCase } from "./get-brand-products.use-case";
import { GetBrandListUseCase } from "./get-top-brands.use-case";

const repo = new BrandsRepository(appRequest);

export const brandsUseCase = {
  getTopBrands: new GetBrandListUseCase(repo),
  getBrandBySlug: new GetBrandBySlugUseCase(repo),
  getBrandProducts: new GetBrandProductsUseCase(repo),
  getBrandCategories: new GetBrandCategoriesUseCase(repo),
};

export {
  GetBrandBySlugUseCase,
  GetBrandCategoriesUseCase,
  GetBrandProductsUseCase,
  GetBrandListUseCase as GetTopBrandsUseCase,
};
