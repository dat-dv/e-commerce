import { AdminProductRepository } from "./infrastructure/product.repository";
import { GetProductUseCase } from "./use-cases/get-product.use-case";
import { GetProductsUseCase } from "./use-cases/get-products.use-case";
import { UpdateProductUseCase } from "./use-cases/update-product.use-case";

export * from "./infrastructure/product.mapper";
export * from "./infrastructure/product.repository";
export * from "./types/product.model";
export * from "./types/product.repository";
export * from "./use-cases/get-product.use-case";
export * from "./use-cases/get-products.use-case";
export * from "./use-cases/update-product.use-case";

const productRepository = new AdminProductRepository();

export const adminProductUseCase = {
  getProducts: new GetProductsUseCase(productRepository),
  getProduct: new GetProductUseCase(productRepository),
  updateProduct: new UpdateProductUseCase(productRepository),
};
