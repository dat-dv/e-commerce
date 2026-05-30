import { AdminProductRepository } from "./infrastructure/product.repository";
import { GetProductsUseCase } from "./use-cases/get-products.use-case";

export * from "./infrastructure/product.repository";
export * from "./types/product.repository";
export * from "./use-cases/get-products.use-case";

const productRepository = new AdminProductRepository();

export const adminProductUseCase = {
  getProducts: new GetProductsUseCase(productRepository),
};
