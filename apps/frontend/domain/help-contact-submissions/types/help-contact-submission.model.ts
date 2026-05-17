export interface TCreateHelpContactSubmissionInput {
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  subject: string;
  message: string;
  imageIds?: string[];
}

export interface TUploadHelpContactImageResponse {
  id: string;
  url: string;
  publicId: string;
}

export interface THelpContactSubmissionAttachment {
  id: string;
  url: string;
  publicId: string;
  width: number | null;
  height: number | null;
  format: string | null;
  bytes: number | null;
}

export interface THelpContactSubmission {
  id: string;
  userId: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  subject: string;
  message: string;
  status: number;
  source: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  attachments: THelpContactSubmissionAttachment[];
}

export interface IUploadHelpContactImageResponse {
  id: string;
  url: string;
  public_id: string;
}

export interface IHelpContactSubmissionResponse {
  id: string;
  user_id: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  subject: string;
  message: string;
  status: number;
  source: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  attachments: Array<{
    id: string;
    url: string;
    public_id: string;
    width: number | null;
    height: number | null;
    format: string | null;
    bytes: number | null;
  }>;
}
