import { UseCase } from "@/utils/use-case";
import { ICartRepository } from "../types/cart.repository";
import { ApiResponse } from "@/utils/request/request.types";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { TUpdateCartItemRequest } from "../types/cart.model";

export class UpdateCartItemUseCase extends UseCase<
  TUpdateCartItemRequest,
  Promise<ApiResponse<TCartItem>>
> {
  constructor(private repository: ICartRepository) {
    super();
  }

  async execute(
    params: TUpdateCartItemRequest,
  ): Promise<ApiResponse<TCartItem>> {
    return this.repository.updateItem(params);
  }
}
