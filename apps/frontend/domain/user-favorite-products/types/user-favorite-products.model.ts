import { TProduct } from "../../products/types/products.model";

export interface TUserFavoriteProductItem {
  userId: string;
  productId: string;
  createdAt: string;
  product?: TProduct;
}

export interface TUserFavoriteProductToggleResponse {
  isFavorited: boolean;
  productId: string;
}
