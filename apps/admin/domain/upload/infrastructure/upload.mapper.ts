import type { IImageResponse } from "@ecommerce/shared";

import type { IAdminImage } from "../types/upload.model";

const toIsoString = (value?: Date | string | null) =>
  value ? new Date(value).toISOString() : undefined;

export class AdminUploadMapper {
  static imageToDomain(image?: IImageResponse): IAdminImage | null {
    if (!image) return null;

    return {
      id: image.id,
      url: image.url,
      publicId: image.public_id,
      width: image.width,
      height: image.height,
      format: image.format,
      bytes: image.bytes,
      createdAt: toIsoString(image.created_at),
      updatedAt: toIsoString(image.updated_at),
    };
  }
}
