import type { IApiResponse, IAttributeListResponse } from '@ecommerce/shared';
import { Controller, Get } from '@nestjs/common';
import createSuccessResponse from 'src/common/respomse';
import { GetAttributesUseCase } from './domain/use-cases/get-attributes.use-case';

@Controller('attributes')
export class AttributesController {
  constructor(private readonly getAttributesUseCase: GetAttributesUseCase) {}

  @Get()
  async getAttributes(): Promise<IApiResponse<IAttributeListResponse>> {
    const result = await this.getAttributesUseCase.execute();
    return createSuccessResponse(result);
  }
}
