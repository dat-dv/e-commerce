import { ApiResponse } from "@/utils/request/request.types";
import { UseCase } from "@/utils/use-case";

import {
  TCreateOrderReturnInput,
  TOrderReturn,
} from "../types/order-return.model";
import { IOrderReturnsRepository } from "../types/order-return.repository";

export class CreateOrderReturnUseCase extends UseCase<
  TCreateOrderReturnInput,
  Promise<ApiResponse<TOrderReturn>>
> {
  constructor(private readonly repository: IOrderReturnsRepository) {
    super();
  }

  execute(input: TCreateOrderReturnInput): Promise<ApiResponse<TOrderReturn>> {
    return this.repository.create(input);
  }
}
