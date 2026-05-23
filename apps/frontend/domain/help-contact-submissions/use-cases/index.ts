import { appRequest } from "@/constants/app-request";

import { HelpContactSubmissionsRepository } from "../infrastructure/help-contact-submissions.repository";
import { CreateHelpContactSubmissionUseCase } from "./create-help-contact-submission.use-case";
import { UploadHelpContactImageUseCase } from "./upload-help-contact-image.use-case";

const repository = new HelpContactSubmissionsRepository(appRequest);

export const helpContactSubmissionsUseCase = {
  create: new CreateHelpContactSubmissionUseCase(repository),
  uploadImage: new UploadHelpContactImageUseCase(repository),
};
