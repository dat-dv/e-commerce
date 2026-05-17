import { ApiResponse } from "@/utils/request/request.types";
import { UseCase } from "@/utils/use-case";

import { TUploadHelpContactImageResponse } from "../types/help-contact-submission.model";
import { IHelpContactSubmissionsRepository } from "../types/help-contact-submission.repository";

export class UploadHelpContactImageUseCase extends UseCase<
  File,
  Promise<ApiResponse<TUploadHelpContactImageResponse>>
> {
  constructor(private readonly repository: IHelpContactSubmissionsRepository) {
    super();
  }

  execute(file: File): Promise<ApiResponse<TUploadHelpContactImageResponse>> {
    return this.repository.uploadImage(file);
  }
}
