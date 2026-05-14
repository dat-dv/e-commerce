import { UseCase } from "@/utils/use-case";
import { ICartRepository } from "../types/cart.repository";
import { TCartItem } from "../types/cart.model";
import { ApiResponse } from "@/utils/request/request.types";

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
