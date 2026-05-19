import { ApiResponse } from "@/utils/request/request.types";
import { UseCase } from "@/utils/use-case";

import { TUploadOrderReturnImageResponse } from "../types/order-return.model";
import { IOrderReturnsRepository } from "../types/order-return.repository";

export class UploadOrderReturnImageUseCase extends UseCase<
  File,
  Promise<ApiResponse<TUploadOrderReturnImageResponse>>
> {
  constructor(private readonly repository: IOrderReturnsRepository) {
    super();
  }

  execute(file: File): Promise<ApiResponse<TUploadOrderReturnImageResponse>> {
    return this.repository.uploadImage(file);
  }
}
