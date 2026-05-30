import type { IApiResponse, IImageResponse } from "@ecommerce/shared";

import { UseCase } from "@/utils/use-case";

import type { IAdminUploadRepository } from "../types/upload.repository";

export class UploadImageUseCase extends UseCase<
  File,
  Promise<IApiResponse<IImageResponse>>
> {
  constructor(private repository: IAdminUploadRepository) {
    super();
  }

  async execute(file: File): Promise<IApiResponse<IImageResponse>> {
    return this.repository.uploadImage(file);
  }
}
