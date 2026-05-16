import { UseCase } from "@/utils/use-case";
import { ICartRepository } from "../types/cart.repository";
import { ApiResponse } from "@/utils/request/request.types";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { TAddToCartRequest } from "../types/cart.model";

export class AddToCartUseCase extends UseCase<
  TAddToCartRequest,
  Promise<ApiResponse<TCartItem>>
> {
  constructor(private repository: ICartRepository) {
    super();
  }

  async execute(params: TAddToCartRequest): Promise<ApiResponse<TCartItem>> {
    return this.repository.addItem(params);
  }
}
