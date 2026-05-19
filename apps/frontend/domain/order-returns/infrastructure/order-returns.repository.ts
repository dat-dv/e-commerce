import { API_ROUTES } from "@/constants/routes";
import { ApiResponse, TRequest } from "@/utils/request/request.types";
import {
  ICreateOrderReturnRequest,
  IImageResponse,
  IOrderReturnResponse,
} from "@ecommerce/shared";

import { OrderReturnMapper } from "./order-return.mapper";
import {
  TCreateOrderReturnInput,
  TOrderReturn,
  TUploadOrderReturnImageResponse,
} from "../types/order-return.model";
import { IOrderReturnsRepository } from "../types/order-return.repository";

export class OrderReturnsRepository implements IOrderReturnsRepository {
  constructor(private readonly request: TRequest) {}

  async uploadImage(
    file: File,
  ): Promise<ApiResponse<TUploadOrderReturnImageResponse>> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await this.request.post<IImageResponse>(
      API_ROUTES.UPLOAD.IMAGE,
      formData,
    );

    return {
      ...response,
      data: OrderReturnMapper.uploadImageToDomain(response.data),
    };
  }

  async create(
    input: TCreateOrderReturnInput,
  ): Promise<ApiResponse<TOrderReturn>> {
    const payload: ICreateOrderReturnRequest = {
      title: input.title,
      description: input.description,
      image_ids: input.imageIds,
    };

    const response = await this.request.post<IOrderReturnResponse>(
      API_ROUTES.ORDER_RETURNS.CREATE(input.orderId),
      payload,
    );

    return {
      ...response,
      data: OrderReturnMapper.toDomain(response.data),
    };
  }
}
