import { CreateHelpContactSubmissionDto } from '../../dto/create-help-contact-submission.dto';

export interface HelpContactSubmissionCreateInput extends CreateHelpContactSubmissionDto {
  user_id?: string;
}

export interface HelpContactSubmissionImageResponse {
  id: string;
  url: string;
  public_id: string;
  width: number | null;
  height: number | null;
  format: string | null;
  bytes: number | null;
}

export interface HelpContactSubmissionResponse {
  id: string;
  user_id: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  subject: string;
  message: string;
  status: number;
  source: string | null;
  metadata: unknown;
  created_at: Date;
  updated_at: Date;
  resolved_at: Date | null;
  attachments: HelpContactSubmissionImageResponse[];
}

export interface IHelpContactSubmissionsRepository {
  create(data: HelpContactSubmissionCreateInput): Promise<HelpContactSubmissionResponse>;
}

export const IHelpContactSubmissionsRepository = Symbol('IHelpContactSubmissionsRepository');
