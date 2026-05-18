import { UseCase } from "@/utils/use-case";
import { ICartRepository } from "../types/cart.repository";
import { ApiResponse } from "@/utils/request/request.types";
import { TUpdateCartItemRequest } from "../types/cart.model";

export class UpdateCartItemUseCase extends UseCase<
  TUpdateCartItemRequest,
  Promise<ApiResponse<boolean>>
> {
  constructor(private repository: ICartRepository) {
    super();
  }

  async execute(params: TUpdateCartItemRequest): Promise<ApiResponse<boolean>> {
    return this.repository.updateItem(params);
  }
}
