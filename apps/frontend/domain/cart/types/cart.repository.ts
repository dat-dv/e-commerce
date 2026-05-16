import { TCartItem } from "@/store/cart-store/cart-store.type";
import { ApiResponse } from "@/utils/request/request.types";
import { TCart } from "./cart.model";

export interface ICartRepository {
  getCart(): Promise<ApiResponse<TCart>>;
  addItem(skuId: string, quantity: number): Promise<ApiResponse<TCartItem>>;
  updateItem(id: string, quantity: number): Promise<ApiResponse<TCartItem>>;
  removeItem(id: string): Promise<ApiResponse<void>>;
}
