import type { IApiResponse, IImageResponse } from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/utils/request/api-client";

import type { IAdminImage } from "../types/upload.model";
import type { IAdminUploadRepository } from "../types/upload.repository";
import { AdminUploadMapper } from "./upload.mapper";

export class AdminUploadRepository implements IAdminUploadRepository {
  async uploadImage(file: File): Promise<IAdminImage> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post<IApiResponse<IImageResponse>>(
      API_ROUTES.UPLOAD.IMAGE,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    const mapped = AdminUploadMapper.imageToDomain(response.data!);
    if (!mapped) throw new Error("Image upload failed: no data returned");
    return mapped;
  }
}
