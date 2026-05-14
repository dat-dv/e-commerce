import { ISku } from "./product";

export interface ICartItem {
  id: string;
  cart_id: string;
  sku_id: string;
  quantity: number;
  sku?: ISku;
}

export interface ICart {
  id: string;
  user_id: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  items?: ICartItem[];
}
