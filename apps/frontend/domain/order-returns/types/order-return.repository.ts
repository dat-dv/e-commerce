import { ApiResponse } from "@/utils/request/request.types";

import {
  TCreateOrderReturnInput,
  TOrderReturn,
  TUploadOrderReturnImageResponse,
} from "./order-return.model";

export interface IOrderReturnsRepository {
  uploadImage(
    file: File,
  ): Promise<ApiResponse<TUploadOrderReturnImageResponse>>;
  create(input: TCreateOrderReturnInput): Promise<ApiResponse<TOrderReturn>>;
}
