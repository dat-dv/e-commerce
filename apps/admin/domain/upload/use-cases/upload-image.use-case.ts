import { UseCase } from "@/utils/use-case";

import type { IAdminImage } from "../types/upload.model";
import type { IAdminUploadRepository } from "../types/upload.repository";

export class UploadImageUseCase extends UseCase<File, Promise<IAdminImage>> {
  constructor(private repository: IAdminUploadRepository) {
    super();
  }

  async execute(file: File): Promise<IAdminImage> {
    return this.repository.uploadImage(file);
  }
}
