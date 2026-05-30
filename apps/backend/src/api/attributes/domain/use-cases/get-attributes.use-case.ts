import type { IAttributeListResponse } from '@ecommerce/shared';
import { Inject, Injectable } from '@nestjs/common';
import { IAttributesRepository } from '../entities/attributes.repository.interface';

@Injectable()
export class GetAttributesUseCase {
  constructor(
    @Inject(IAttributesRepository)
    private readonly attributesRepository: IAttributesRepository,
  ) {}

  execute(): Promise<IAttributeListResponse> {
    return this.attributesRepository.findMany();
  }
}
