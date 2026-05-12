// src/api/homepage/homepage.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { GetHomepageSectionsUseCase } from './domain/use-cases/get-homepage-sections.use-case';
import createSuccessResponse from 'src/common/respomse';

@Controller('homepage')
export class HomepageController {
  constructor(private readonly getHomepageSectionsUseCase: GetHomepageSectionsUseCase) {}

  @Get('sections')
  async getSections(@Query('lang') lang = 'vi') {
    const result = await this.getHomepageSectionsUseCase.execute(lang);
    return createSuccessResponse(result);
  }
}
