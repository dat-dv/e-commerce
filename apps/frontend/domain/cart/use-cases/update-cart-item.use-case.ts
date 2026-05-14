import { UseCase } from "@/utils/use-case";
import { ICartRepository } from "../types/cart.repository";
import { ApiResponse } from "@/utils/request/request.types";
import { TCartItem } from "@/store/cart-store/cart-store.type";

export class UpdateCartItemUseCase extends UseCase<
  { id: string; quantity: number },
  Promise<ApiResponse<TCartItem>>
> {
  constructor(private repository: ICartRepository) {
    super();
  }

  async execute(params: {
    id: string;
    quantity: number;
  }): Promise<ApiResponse<TCartItem>> {
    return this.repository.updateItem(params.id, params.quantity);
  }
}
