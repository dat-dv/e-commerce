import { appRequest } from "@/utils/request";
import { ProductsRepository } from "../infrastructure/products.repository";
import { CreateReviewUseCase } from "./create-review.use-case";
import { GetBasedOnInterestUseCase } from "./get-based-on-interest.use-case";
import { GetFlashSaleUseCase } from "./get-flash-sale.use-case";
import { GetProductByIdUseCase } from "./get-product-by-id.use-case";
import { GetProductReviewsUseCase } from "./get-product-reviews.use-case";
import { GetProductsUseCase } from "./get-products.use-case";
import { GetRecentlyViewedUseCase } from "./get-recently-viewed.use-case";
import { GetRecommendedUseCase } from "./get-recommended.use-case";
import { GetSimilarProductsUseCase } from "./get-similar-products.use-case";

const repo = new ProductsRepository(appRequest);

export const productsUseCase = {
  getRecommended: new GetRecommendedUseCase(repo),
  getBasedOnInterest: new GetBasedOnInterestUseCase(repo),
  getRecentlyViewed: new GetRecentlyViewedUseCase(repo),
  getFlashSale: new GetFlashSaleUseCase(repo),
  getProductById: new GetProductByIdUseCase(repo),
  getProducts: new GetProductsUseCase(repo),
  getProductReviews: new GetProductReviewsUseCase(repo),
  createReview: new CreateReviewUseCase(repo),
  getSimilarProducts: new GetSimilarProductsUseCase(repo),
};
