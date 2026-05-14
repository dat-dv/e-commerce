import { API_ROUTES } from "@/constants/routes";
import { ApiResponse, TRequest } from "@/utils/request/request.types";
import { ICartRepository } from "../types/cart.repository";
import { TCart } from "../types/cart.model";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { CartMapper, ICartDTO, ICartItemDTO } from "./cart.mapper";

export class CartRepository implements ICartRepository {
  constructor(private request: TRequest) {}

  async getCart(): Promise<ApiResponse<TCart>> {
    const response = await this.request.get<ICartDTO>(API_ROUTES.CART.BASE);
    return {
      ...response,
      data: response.data ? CartMapper.toDomain(response.data) : undefined,
    } as ApiResponse<TCart>;
  }

  async addItem(
    sku_id: string,
    quantity: number,
  ): Promise<ApiResponse<TCartItem>> {
    const response = await this.request.post<ICartItemDTO>(
      API_ROUTES.CART.ITEMS,
      {
        sku_id,
        quantity,
      },
    );
    return {
      ...response,
      data: response.data ? CartMapper.toDomainItem(response.data) : undefined,
    } as ApiResponse<TCartItem>;
  }

  async updateItem(
    id: string,
    quantity: number,
  ): Promise<ApiResponse<TCartItem>> {
    const response = await this.request.put<ICartItemDTO>(
      API_ROUTES.CART.ITEM(id),
      {
        quantity,
      },
    );
    return {
      ...response,
      data: response.data ? CartMapper.toDomainItem(response.data) : undefined,
    } as ApiResponse<TCartItem>;
  }

  async removeItem(id: string): Promise<ApiResponse<void>> {
    const response = await this.request.delete<void>(API_ROUTES.CART.ITEM(id));
    return response;
  }
}
