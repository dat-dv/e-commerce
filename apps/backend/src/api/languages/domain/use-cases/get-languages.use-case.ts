import type { ILanguageListResponse } from '@ecommerce/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ILanguagesRepository } from '../entities/languages.repository.interface';

@Injectable()
export class GetLanguagesUseCase {
  constructor(
    @Inject(ILanguagesRepository)
    private readonly languagesRepository: ILanguagesRepository,
  ) {}

  execute(): Promise<ILanguageListResponse> {
    return this.languagesRepository.findMany();
  }
}
