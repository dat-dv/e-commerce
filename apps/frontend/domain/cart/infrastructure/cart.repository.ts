import { API_ROUTES } from "@/constants/routes";
import { ApiResponse, TRequest } from "@/utils/request/request.types";
import { ICartRepository } from "../types/cart.repository";
import {
  TCart,
  TAddToCartRequest,
  TUpdateCartItemRequest,
} from "../types/cart.model";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { CartMapper } from "./cart.mapper";
import { ICartResponse, ICartItemResponse } from "@ecommerce/shared";

export class CartRepository implements ICartRepository {
  constructor(private request: TRequest) {}

  async getCart(): Promise<ApiResponse<TCart>> {
    const response = await this.request.get<ICartResponse>(
      API_ROUTES.CART.BASE,
    );
    return {
      ...response,
      data: response.data ? CartMapper.toDomain(response.data) : undefined,
    } as ApiResponse<TCart>;
  }

  async addItem(request: TAddToCartRequest): Promise<ApiResponse<TCartItem>> {
    const response = await this.request.post<ICartItemResponse>(
      API_ROUTES.CART.ITEMS,
      {
        sku_id: request.skuId,
        quantity: request.quantity,
      },
    );
    return {
      ...response,
      data: response.data ? CartMapper.toDomainItem(response.data) : undefined,
    } as ApiResponse<TCartItem>;
  }

  async updateItem(
    request: TUpdateCartItemRequest,
  ): Promise<ApiResponse<boolean>> {
    const response = await this.request.put<boolean>(
      API_ROUTES.CART.ITEM(request.id),
      {
        quantity: request.quantity,
      },
    );
    return response;
  }

  async removeItem(id: string): Promise<ApiResponse<boolean>> {
    const response = await this.request.delete<boolean>(
      API_ROUTES.CART.ITEM(id),
    );
    return response;
  }
}
