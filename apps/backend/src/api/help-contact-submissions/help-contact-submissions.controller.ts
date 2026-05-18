import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IApiResponse } from '@ecommerce/shared';
import createSuccessResponse from 'src/common/respomse';
import type { Request } from 'express';
import { CreateHelpContactSubmissionDto } from './dto/create-help-contact-submission.dto';
import { HelpContactSubmissionResponse } from './domain/entities/help-contact-submissions.repository.interface';
import { CreateHelpContactSubmissionUseCase } from './domain/use-cases/create-help-contact-submission.use-case';

@ApiTags('Help Contact Submissions')
@Controller('help-contact-submissions')
export class HelpContactSubmissionsController {
  constructor(private readonly createHelpContactSubmissionUseCase: CreateHelpContactSubmissionUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a help contact submission' })
  @ApiResponse({ status: 201, description: 'Help contact submission created successfully' })
  async create(
    @Req() req: Request,
    @Body() dto: CreateHelpContactSubmissionDto,
  ): Promise<IApiResponse<HelpContactSubmissionResponse>> {
    const result = await this.createHelpContactSubmissionUseCase.execute(req.user?.sub, dto);
    return createSuccessResponse(result);
  }
}
