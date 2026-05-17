import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<IApiResponse<IHomepageSectionResponse[]>> {
    const userId = req.user?.sub;
    const result = await this.getHomepageSectionsUseCase.execute({
      languageCode: lang,
      userId,
      page,
      limit,
    });
    return createSuccessResponse(result);
  }
}
