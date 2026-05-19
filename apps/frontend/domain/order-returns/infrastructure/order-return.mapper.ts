import { IImageResponse, IOrderReturnResponse } from "@ecommerce/shared";

import {
  TOrderReturn,
  TOrderReturnImage,
  TUploadOrderReturnImageResponse,
} from "../types/order-return.model";

export class OrderReturnMapper {
  static uploadImageToDomain(
    dto: IImageResponse,
  ): TUploadOrderReturnImageResponse {
    return {
      id: dto.id,
      url: dto.url,
      publicId: dto.public_id,
    };
  }

  static imageToDomain(
    dto: NonNullable<IOrderReturnResponse["images"]>[number],
  ): TOrderReturnImage {
    return {
      id: dto.id,
      imageId: dto.image_id,
      url: dto.image?.url,
      publicId: dto.image?.public_id,
    };
  }

  static toDomain(dto: IOrderReturnResponse): TOrderReturn {
    return {
      id: dto.id,
      orderId: dto.order_id,
      title: dto.title,
      description: dto.description,
      status: dto.status,
      createdById: dto.created_by_id,
      createdAt: dto.created_at ? new Date(dto.created_at).toISOString() : "",
      updatedAt: dto.updated_at ? new Date(dto.updated_at).toISOString() : "",
      images: dto.images?.map((image) => this.imageToDomain(image)) ?? [],
    };
  }
}
