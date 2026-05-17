import {
  IHelpContactSubmissionResponse,
  IUploadHelpContactImageResponse,
  THelpContactSubmission,
  TUploadHelpContactImageResponse,
} from "../types/help-contact-submission.model";

export class HelpContactSubmissionsMapper {
  static uploadImageToDomain(
    dto: IUploadHelpContactImageResponse,
  ): TUploadHelpContactImageResponse {
    return {
      id: dto.id,
      url: dto.url,
      publicId: dto.public_id,
    };
  }

  static submissionToDomain(
    dto: IHelpContactSubmissionResponse,
  ): THelpContactSubmission {
    return {
      id: dto.id,
      userId: dto.user_id,
      contactName: dto.contact_name,
      contactEmail: dto.contact_email,
      contactPhone: dto.contact_phone,
      subject: dto.subject,
      message: dto.message,
      status: dto.status,
      source: dto.source,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      resolvedAt: dto.resolved_at,
      attachments: dto.attachments.map((attachment) => ({
        id: attachment.id,
        url: attachment.url,
        publicId: attachment.public_id,
        width: attachment.width,
        height: attachment.height,
        format: attachment.format,
        bytes: attachment.bytes,
      })),
    };
  }
}
