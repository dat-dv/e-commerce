import { API_ROUTES } from "@/constants/routes";
import { ApiResponse, TRequest } from "@/utils/request/request.types";

import { HelpContactSubmissionsMapper } from "./help-contact-submissions.mapper";
import {
  IHelpContactSubmissionResponse,
  IUploadHelpContactImageResponse,
  TCreateHelpContactSubmissionInput,
  THelpContactSubmission,
  TUploadHelpContactImageResponse,
} from "../types/help-contact-submission.model";
import { IHelpContactSubmissionsRepository } from "../types/help-contact-submission.repository";

export class HelpContactSubmissionsRepository implements IHelpContactSubmissionsRepository {
  constructor(private readonly request: TRequest) {}

  async uploadImage(
    file: File,
  ): Promise<ApiResponse<TUploadHelpContactImageResponse>> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await this.request.post<IUploadHelpContactImageResponse>(
      API_ROUTES.UPLOAD.HELP_CONTACT_IMAGE,
      formData,
    );

    return {
      ...response,
      data: HelpContactSubmissionsMapper.uploadImageToDomain(response.data),
    };
  }

  async create(
    input: TCreateHelpContactSubmissionInput,
  ): Promise<ApiResponse<THelpContactSubmission>> {
    const response = await this.request.post<IHelpContactSubmissionResponse>(
      API_ROUTES.HELP_CONTACT_SUBMISSIONS.BASE,
      {
        contact_name: input.contactName,
        contact_email: input.contactEmail,
        contact_phone: input.contactPhone,
        subject: input.subject,
        message: input.message,
        image_ids: input.imageIds,
      },
    );

    return {
      ...response,
      data: HelpContactSubmissionsMapper.submissionToDomain(response.data),
    };
  }
}
