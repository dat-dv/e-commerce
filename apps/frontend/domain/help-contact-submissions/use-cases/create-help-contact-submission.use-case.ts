import { ApiResponse } from "@/utils/request/request.types";
import { UseCase } from "@/utils/use-case";

import {
  TCreateHelpContactSubmissionInput,
  THelpContactSubmission,
} from "../types/help-contact-submission.model";
import { IHelpContactSubmissionsRepository } from "../types/help-contact-submission.repository";

export class CreateHelpContactSubmissionUseCase extends UseCase<
  TCreateHelpContactSubmissionInput,
  Promise<ApiResponse<THelpContactSubmission>>
> {
  constructor(private readonly repository: IHelpContactSubmissionsRepository) {
    super();
  }

  execute(
    input: TCreateHelpContactSubmissionInput,
  ): Promise<ApiResponse<THelpContactSubmission>> {
    return this.repository.create(input);
  }
}
