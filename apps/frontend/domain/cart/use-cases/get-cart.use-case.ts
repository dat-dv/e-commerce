import { UseCase } from "@/utils/use-case";
import { ICartRepository } from "../types/cart.repository";
import { ICart } from "../types/cart.model";
import { ApiResponse } from "@/utils/request/request.types";

export class GetCartUseCase extends UseCase<void, Promise<ApiResponse<ICart>>> {
  constructor(private repository: ICartRepository) {
    super();
  }

  async execute(): Promise<ApiResponse<ICart>> {
    return this.repository.getCart();
  }
}
