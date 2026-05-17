import { ApiResponse } from "@/utils/request/request.types";

import {
  TCreateHelpContactSubmissionInput,
  THelpContactSubmission,
  TUploadHelpContactImageResponse,
} from "./help-contact-submission.model";

export interface IHelpContactSubmissionsRepository {
  uploadImage(
    file: File,
  ): Promise<ApiResponse<TUploadHelpContactImageResponse>>;
  create(
    input: TCreateHelpContactSubmissionInput,
  ): Promise<ApiResponse<THelpContactSubmission>>;
}
