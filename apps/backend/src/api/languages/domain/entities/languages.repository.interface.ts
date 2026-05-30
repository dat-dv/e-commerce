import type { ILanguageListResponse } from '@ecommerce/shared';

export interface ILanguagesRepository {
  findMany(): Promise<ILanguageListResponse>;
}

export const ILanguagesRepository = Symbol('ILanguagesRepository');
