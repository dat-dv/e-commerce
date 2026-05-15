import { ICart, ICartItem } from "./cart.types";


export type ICartResponse = ICart;

export type IAddToCartResponse = ICart;

export type IUpdateCartItemResponse = ICartItem;

export interface IRemoveFromCartResponse {
  success: boolean;
}
