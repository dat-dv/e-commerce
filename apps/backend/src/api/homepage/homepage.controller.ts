import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query, Req } from '@nestjs/common';
import { GetHomepageSectionsUseCase } from './domain/use-cases/get-homepage-sections.use-case';
import createSuccessResponse from 'src/common/respomse';
import { Language } from 'src/common/decorators/language.decorator';
import { IApiResponse, IHomepageSectionResponse } from '@ecommerce/shared';
import type { Request } from 'express';

@Controller('homepage')
export class HomepageController {
  constructor(private readonly getHomepageSectionsUseCase: GetHomepageSectionsUseCase) {}

  @Get('sections')
  async getSections(
    @Req() req: Request,
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
