import { AdminProductCategoryRepository } from "./infrastructure/product-category.repository";
import { GetCategoryTreeUseCase } from "./use-cases/get-category-tree.use-case";

export * from "./infrastructure/product-category.repository";
export * from "./types/product-category.repository";
export * from "./use-cases/get-category-tree.use-case";

const productCategoryRepository = new AdminProductCategoryRepository();

export const adminProductCategoryUseCase = {
  getCategoryTree: new GetCategoryTreeUseCase(productCategoryRepository),
};
