import { UseCase } from "@/utils/use-case";
import { ICartRepository } from "../types/cart.repository";
import { TCart } from "../types/cart.model";
import { ApiResponse } from "@/utils/request/request.types";

export class GetCartUseCase extends UseCase<void, Promise<ApiResponse<TCart>>> {
  constructor(private repository: ICartRepository) {
    super();
  }

  async execute(): Promise<ApiResponse<TCart>> {
    return this.repository.getCart();
  }
}
