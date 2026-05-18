export interface ICreateReviewRequest {
  product_id: string;
  sku_id: string;
  rating: number;
  comment?: string;
  images?: string[];
}

export interface IUpdateReviewRequest {
  rating?: number;
  comment?: string;
  images?: string[];
}

export enum EReviewSort {
  NEWEST = "newest",
  OLDEST = "oldest",
  RATING_DESC = "rating_desc",
  RATING_ASC = "rating_asc",
}

export interface IGetProductReviewsParams {
  page?: number;
  limit?: number;
  rating?: number;
  has_images?: boolean;
  sort?: EReviewSort;
}
