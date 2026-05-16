import { TCartItem } from "@/store/cart-store/cart-store.type";
import { ApiResponse } from "@/utils/request/request.types";
import { TCart, TAddToCartRequest, TUpdateCartItemRequest } from "./cart.model";

export interface ICartRepository {
  getCart(): Promise<ApiResponse<TCart>>;
  addItem(request: TAddToCartRequest): Promise<ApiResponse<TCartItem>>;
  updateItem(request: TUpdateCartItemRequest): Promise<ApiResponse<TCartItem>>;
  removeItem(id: string): Promise<ApiResponse<void>>;
}
