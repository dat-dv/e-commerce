import { appRequest } from "@/utils/request";
import { BrandsRepository } from "../infrastructure/brands.repository";
import { GetBrandBySlugUseCase } from "./get-brand-by-slug.use-case";
import { GetBrandCategoriesUseCase } from "./get-brand-categories.use-case";
import { GetBrandProductsUseCase } from "./get-brand-products.use-case";
import { GetTopBrandsUseCase } from "./get-top-brands.use-case";

const repo = new BrandsRepository(appRequest);

export const brandsUseCase = {
  getTopBrands: new GetTopBrandsUseCase(repo),
  getBrandBySlug: new GetBrandBySlugUseCase(repo),
  getBrandProducts: new GetBrandProductsUseCase(repo),
  getBrandCategories: new GetBrandCategoriesUseCase(repo),
};

export {
  GetBrandBySlugUseCase,
  GetBrandCategoriesUseCase,
  GetBrandProductsUseCase,
  GetTopBrandsUseCase,
};
