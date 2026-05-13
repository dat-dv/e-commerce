import { appRequest } from "@/utils/request/request";
import { ProductsRepository } from "../infrastructure/products.repository";
import { GetRecommendedUseCase } from "./get-recommended.use-case";
import { GetBasedOnInterestUseCase } from "./get-based-on-interest.use-case";
import { GetRecentlyViewedUseCase } from "./get-recently-viewed.use-case";
import { GetFlashSaleUseCase } from "./get-flash-sale.use-case";
import { GetProductByIdUseCase } from "./get-product-by-id.use-case";
import { GetProductsUseCase } from "./get-products.use-case";

const repo = new ProductsRepository(appRequest);

export const productsUseCase = {
  getRecommended: new GetRecommendedUseCase(repo),
  getBasedOnInterest: new GetBasedOnInterestUseCase(repo),
  getRecentlyViewed: new GetRecentlyViewedUseCase(repo),
  getFlashSale: new GetFlashSaleUseCase(repo),
  getProductById: new GetProductByIdUseCase(repo),
  getProducts: new GetProductsUseCase(repo),
};
