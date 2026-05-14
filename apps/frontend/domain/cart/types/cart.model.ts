import { ICartItem } from "@/store/cart-store/cart-store.type";

export type TCartItem = ICartItem;

export interface ICart {
  id: string;
  user_id: string;
  items: TCartItem[];
}
