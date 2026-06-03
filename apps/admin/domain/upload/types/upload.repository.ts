import type { IAdminImage } from "./upload.model";

export interface IAdminUploadRepository {
  uploadImage(file: File): Promise<IAdminImage>;
}
