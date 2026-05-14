import { UseCase } from "@/utils/use-case";
import { ICartRepository } from "../types/cart.repository";
import { ApiResponse } from "@/utils/request/request.types";
import { TCartItem } from "@/store/cart-store/cart-store.type";

export class AddToCartUseCase extends UseCase<
  { sku_id: string; quantity: number },
  Promise<ApiResponse<TCartItem>>
> {
  constructor(private repository: ICartRepository) {
    super();
  }

  async execute(params: {
    sku_id: string;
    quantity: number;
  }): Promise<ApiResponse<TCartItem>> {
    return this.repository.addItem(params.sku_id, params.quantity);
  }
}
