import type { IApiResponse, ILanguageListResponse } from '@ecommerce/shared';
import { Controller, Get } from '@nestjs/common';
import createSuccessResponse from 'src/common/respomse';
import { GetLanguagesUseCase } from './domain/use-cases/get-languages.use-case';

@Controller('languages')
export class LanguagesController {
  constructor(private readonly getLanguagesUseCase: GetLanguagesUseCase) {}

  @Get()
  async getLanguages(): Promise<IApiResponse<ILanguageListResponse>> {
    const result = await this.getLanguagesUseCase.execute();
    return createSuccessResponse(result);
  }
}
