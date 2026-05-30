import { AdminBrandRepository } from "./infrastructure/brand.repository";
import { GetBrandsUseCase } from "./use-cases/get-brands.use-case";

export * from "./infrastructure/brand.repository";
export * from "./types/brand.repository";
export * from "./use-cases/get-brands.use-case";

const brandRepository = new AdminBrandRepository();

export const adminBrandUseCase = {
  getBrands: new GetBrandsUseCase(brandRepository),
};
