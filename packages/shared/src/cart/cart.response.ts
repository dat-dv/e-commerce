import { Cart, CartItem } from "../index";

export type ICartResponse = Cart;

export type ICartItemResponse = CartItem;

export type IAddToCartResponse = Cart;

export type IUpdateCartItemResponse = CartItem;

export interface IRemoveFromCartResponse {
  success: boolean;
}
