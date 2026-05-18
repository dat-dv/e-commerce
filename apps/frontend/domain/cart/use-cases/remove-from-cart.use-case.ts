import { UseCase } from "@/utils/use-case";
import { ICartRepository } from "../types/cart.repository";
import { ApiResponse } from "@/utils/request/request.types";

export class RemoveFromCartUseCase extends UseCase<
  string,
  Promise<ApiResponse<boolean>>
> {
  constructor(private repository: ICartRepository) {
    super();
  }

  async execute(id: string): Promise<ApiResponse<boolean>> {
    return this.repository.removeItem(id);
  }
}
