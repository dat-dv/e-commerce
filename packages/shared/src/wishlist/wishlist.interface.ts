// packages/shared/src/wishlist/wishlist.interface.ts

import { IProductResponse } from "../product/product.response";

export interface IWishlistResponse {
  user_id: string;
  product_id: string;
  created_at: Date;
  product?: IProductResponse;
}

export interface IToggleWishlistResponse {
  is_favorited: boolean;
  product_id: string;
}
