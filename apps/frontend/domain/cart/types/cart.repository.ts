import { ApiResponse } from "@/utils/request/request.types";
import { TCartItem, ICart } from "./cart.model";

export interface ICartRepository {
  getCart(): Promise<ApiResponse<ICart>>;
  addItem(sku_id: string, quantity: number): Promise<ApiResponse<TCartItem>>;
  updateItem(id: string, quantity: number): Promise<ApiResponse<TCartItem>>;
  removeItem(id: string): Promise<ApiResponse<void>>;
}
