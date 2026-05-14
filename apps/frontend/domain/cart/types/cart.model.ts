import { TCartItem } from "@/store/cart-store/cart-store.type";

export interface TCart {
  id: string;
  user_id: string;
  items: TCartItem[];
}
