import { TCartItem } from "@/store/cart-store/cart-store.type";

export interface TCart {
  id: string;
  userId: string;
  items: TCartItem[];
}
