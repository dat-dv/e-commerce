import { Controller, Get } from '@nestjs/common';
import { GetHomepageSectionsUseCase } from './domain/use-cases/get-homepage-sections.use-case';
import createSuccessResponse from 'src/common/respomse';
import { Language } from 'src/common/decorators/language.decorator';
import { IApiResponse, IHomepageSectionResponse } from '@ecommerce/shared';

@Controller('homepage')
export class HomepageController {
  constructor(private readonly getHomepageSectionsUseCase: GetHomepageSectionsUseCase) {}

  @Get('sections')
  async getSections(@Language() lang: string): Promise<IApiResponse<IHomepageSectionResponse[]>> {
    const result = await this.getHomepageSectionsUseCase.execute(lang);
    return createSuccessResponse(result);
  }
}
