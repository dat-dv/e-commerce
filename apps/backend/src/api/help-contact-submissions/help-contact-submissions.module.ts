import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { HelpContactSubmissionsController } from './help-contact-submissions.controller';
import { IHelpContactSubmissionsRepository } from './domain/entities/help-contact-submissions.repository.interface';
import { HelpContactSubmissionsRepository } from './domain/infrastructure/help-contact-submissions.repository';
import { CreateHelpContactSubmissionUseCase } from './domain/use-cases/create-help-contact-submission.use-case';

@Module({
  imports: [AuthModule],
  controllers: [HelpContactSubmissionsController],
  providers: [
    CreateHelpContactSubmissionUseCase,
    {
      provide: IHelpContactSubmissionsRepository,
      useClass: HelpContactSubmissionsRepository,
    },
  ],
})
export class HelpContactSubmissionsModule {}
