import type { IApiResponse, IImageResponse } from "@ecommerce/shared";

export interface IAdminUploadRepository {
  uploadImage(file: File): Promise<IApiResponse<IImageResponse>>;
}
