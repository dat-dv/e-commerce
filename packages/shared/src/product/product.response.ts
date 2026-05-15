import { IProduct, IReview } from "./product.types";


export interface IProductDetailResponse extends IProduct {}

export interface IProductListResponse {
  data: IProduct[];
  total: number;
  page: number;
  limit: number;
}

export interface IReviewListResponse {
  data: IReview[];
  total: number;
  page: number;
  limit: number;
}
