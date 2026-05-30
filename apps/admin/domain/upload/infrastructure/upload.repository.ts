import type { IApiResponse, IImageResponse } from "@ecommerce/shared";

import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/utils/request/api-client";

import type { IAdminUploadRepository } from "../types/upload.repository";

export class AdminUploadRepository implements IAdminUploadRepository {
  async uploadImage(file: File): Promise<IApiResponse<IImageResponse>> {
    const formData = new FormData();
    formData.append("image", file);

    return apiClient.post<IApiResponse<IImageResponse>>(
      API_ROUTES.UPLOAD.IMAGE,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  }
}
