import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IApiResponse } from '@ecommerce/shared';
import { Request } from 'express';
import createSuccessResponse from 'src/common/respomse';
import type { RequestWithUser } from 'src/shared/types/request.type';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';
import { CreateHelpContactSubmissionDto } from './dto/create-help-contact-submission.dto';
import { HelpContactSubmissionResponse } from './domain/entities/help-contact-submissions.repository.interface';
import { CreateHelpContactSubmissionUseCase } from './domain/use-cases/create-help-contact-submission.use-case';

type OptionalRequestWithUser = Omit<Request, 'user'> & {
  user?: RequestWithUser['user'];
};

@ApiTags('Help Contact Submissions')
@Controller('help-contact-submissions')
@UseGuards(OptionalAuthGuard)
export class HelpContactSubmissionsController {
  constructor(private readonly createHelpContactSubmissionUseCase: CreateHelpContactSubmissionUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a help contact submission' })
  @ApiResponse({ status: 201, description: 'Help contact submission created successfully' })
  async create(
    @Req() req: OptionalRequestWithUser,
    @Body() dto: CreateHelpContactSubmissionDto,
  ): Promise<IApiResponse<HelpContactSubmissionResponse>> {
    const result = await this.createHelpContactSubmissionUseCase.execute(req.user?.sub, dto);
    return createSuccessResponse(result);
  }
}
