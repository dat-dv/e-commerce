import { ApiResponse } from "@/utils/request/request.types";
import { IProduct } from "./products.model";

export interface IProductsRepository {
  getRecommended(): Promise<ApiResponse<IProduct[]>>;
  getBasedOnInterest(): Promise<ApiResponse<IProduct[]>>;
  getRecentlyViewed(): Promise<ApiResponse<IProduct[]>>;
  getFlashSale(): Promise<ApiResponse<IProduct[]>>;
}
