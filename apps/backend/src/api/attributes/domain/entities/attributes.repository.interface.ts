import type { IAttributeListResponse } from '@ecommerce/shared';

export interface IAttributesRepository {
  findMany(): Promise<IAttributeListResponse>;
}

export const IAttributesRepository = Symbol('IAttributesRepository');
