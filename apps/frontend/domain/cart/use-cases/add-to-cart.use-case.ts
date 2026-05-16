import { UseCase } from "@/utils/use-case";
import { ICartRepository } from "../types/cart.repository";
import { ApiResponse } from "@/utils/request/request.types";
import { TCartItem } from "@/store/cart-store/cart-store.type";

export interface TAddToCartInput {
  skuId: string;
  quantity: number;
}

export class AddToCartUseCase extends UseCase<
  TAddToCartInput,
  Promise<ApiResponse<TCartItem>>
> {
  constructor(private repository: ICartRepository) {
    super();
  }

  async execute(params: TAddToCartInput): Promise<ApiResponse<TCartItem>> {
    return this.repository.addItem(params.skuId, params.quantity);
  }
}
