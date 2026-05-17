import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateHelpContactSubmissionDto } from '../../dto/create-help-contact-submission.dto';
import {
  IHelpContactSubmissionsRepository,
  HelpContactSubmissionCreateInput,
  HelpContactSubmissionResponse,
} from '../entities/help-contact-submissions.repository.interface';

@Injectable()
export class CreateHelpContactSubmissionUseCase {
  constructor(
    @Inject(IHelpContactSubmissionsRepository)
    private readonly repository: IHelpContactSubmissionsRepository,
  ) {}

  async execute(
    userId: string | undefined,
    dto: CreateHelpContactSubmissionDto,
  ): Promise<HelpContactSubmissionResponse> {
    if (!dto.contact_email && !dto.contact_phone) {
      throw new BadRequestException('Please provide an email or phone number so support can reply.');
    }

    const payload: HelpContactSubmissionCreateInput = {
      ...dto,
      user_id: userId,
      image_ids: dto.image_ids?.filter(Boolean),
    };

    return this.repository.create(payload);
  }
}
