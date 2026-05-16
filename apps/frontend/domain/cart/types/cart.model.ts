import { TCartItem } from "@/store/cart-store/cart-store.type";

export interface TCart {
  id: string;
  userId: string;
  items: TCartItem[];
}

export interface TAddToCartRequest {
  skuId: string;
  quantity: number;
}

export interface TUpdateCartItemRequest {
  id: string;
  quantity: number;
}
