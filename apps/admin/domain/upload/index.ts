import { AdminUploadRepository } from "./infrastructure/upload.repository";
import { UploadImageUseCase } from "./use-cases/upload-image.use-case";

export * from "./infrastructure/upload.mapper";
export * from "./infrastructure/upload.repository";
export * from "./types/upload.model";
export * from "./types/upload.repository";
export * from "./use-cases/upload-image.use-case";

const uploadRepository = new AdminUploadRepository();

export const adminUploadUseCase = {
  uploadImage: new UploadImageUseCase(uploadRepository),
};
