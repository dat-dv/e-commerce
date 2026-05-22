// packages/shared/src/user-favorite-product/user-favorite-product.interface.ts

import { IProductResponse } from "../product/product.response";

export interface IUserFavoriteProductResponse {
  user_id: string;
  product_id: string;
  created_at: Date;
  product?: IProductResponse;
}

export interface IToggleUserFavoriteProductResponse {
  is_favorited: boolean;
  product_id: string;
}

export interface IGetUserFavoriteProductsRequest {
  page?: number;
  limit?: number;
}
