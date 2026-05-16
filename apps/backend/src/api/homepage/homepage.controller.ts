import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GetHomepageSectionsUseCase } from './domain/use-cases/get-homepage-sections.use-case';
import createSuccessResponse from 'src/common/respomse';
import { Language } from 'src/common/decorators/language.decorator';
import { IApiResponse, IHomepageSectionResponse } from '@ecommerce/shared';
import type { RequestWithUser } from 'src/shared/types/request.type';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';

@Controller('homepage')
export class HomepageController {
  constructor(private readonly getHomepageSectionsUseCase: GetHomepageSectionsUseCase) {}

  @Get('sections')
  @UseGuards(OptionalAuthGuard)
  async getSections(
    @Req() req: RequestWithUser,
    @Language() lang: string,
  ): Promise<IApiResponse<IHomepageSectionResponse[]>> {
    const userId = req.user?.sub;
    const result = await this.getHomepageSectionsUseCase.execute(lang, userId);
    return createSuccessResponse(result);
  }
}
