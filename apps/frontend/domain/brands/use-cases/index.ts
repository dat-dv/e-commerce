import { appRequest } from "@/utils/request/request";
import { BrandsRepository } from "../infrastructure/brands.repository";
import { GetTopBrandsUseCase } from "./get-top-brands.use-case";
import { GetBrandBySlugUseCase } from "./get-brand-by-slug.use-case";
import { GetBrandProductsUseCase } from "./get-brand-products.use-case";
import { GetBrandCategoriesUseCase } from "./get-brand-categories.use-case";

const repo = new BrandsRepository(appRequest);

export const brandsUseCase = {
  getTopBrands: new GetTopBrandsUseCase(repo),
  getBrandBySlug: new GetBrandBySlugUseCase(repo),
  getBrandProducts: new GetBrandProductsUseCase(repo),
  getBrandCategories: new GetBrandCategoriesUseCase(repo),
};

export {
  GetTopBrandsUseCase,
  GetBrandBySlugUseCase,
  GetBrandProductsUseCase,
  GetBrandCategoriesUseCase,
};
