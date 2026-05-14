import { UseCase } from "@/utils/use-case";
import { ICartRepository } from "../types/cart.repository";
import { TCartItem } from "../types/cart.model";
import { ApiResponse } from "@/utils/request/request.types";

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
