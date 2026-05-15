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
