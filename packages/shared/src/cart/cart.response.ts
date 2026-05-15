import { Cart, CartItem } from "../index";
import { ISkuResponse } from "../product/product.response";

export interface ICartItemResponse extends CartItem {
  sku?: ISkuResponse;
}

export interface ICartResponse extends Cart {
  items?: ICartItemResponse[];
}

export type IAddToCartResponse = ICartResponse;

export type IUpdateCartItemResponse = ICartItemResponse;

export interface IRemoveFromCartResponse {
  success: boolean;
}
