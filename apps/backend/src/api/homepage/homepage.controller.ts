import { IApiResponse, IHomepageSectionResponse } from '@ecommerce/shared';
import { Controller, Get, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Language } from 'src/common/decorators/language.decorator';
import createSuccessResponse from 'src/common/respomse';
import { GetHomepageSectionsUseCase } from './domain/use-cases/get-homepage-sections.use-case';
import { GetHomepageSectionsDto } from './dto/get-homepage-sections.dto';

@Controller('homepage')
export class HomepageController {
  constructor(private readonly getHomepageSectionsUseCase: GetHomepageSectionsUseCase) {}

  @Get('sections')
  async getSections(
    @Req() req: Request,
    @Language() lang: string,
    @Query() query: GetHomepageSectionsDto,
  ): Promise<IApiResponse<IHomepageSectionResponse[]>> {
    const userId = req.user?.sub;
    const result = await this.getHomepageSectionsUseCase.execute({
      languageCode: lang,
      userId,
      page: query.page,
      limit: query.limit,
    });
    return createSuccessResponse(result);
  }
}
