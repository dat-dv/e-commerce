import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { Language } from 'src/common/decorators/language.decorator';
import { GetTopBrandsUseCase } from './domain/use-cases/get-top-brands.use-case';
import createSuccessResponse from 'src/common/respomse';

@Controller('brands')
export class BrandsController {
  constructor(private readonly getTopBrandsUseCase: GetTopBrandsUseCase) {}

  @Get('top')
  async getTopBrands(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Language() lang: string,
  ) {
    const parsedLimit = Math.min(50, limit);
    const result = await this.getTopBrandsUseCase.execute(page, parsedLimit, lang);
    return createSuccessResponse(result);
  }
}
