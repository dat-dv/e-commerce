import type { ICategoryResponse, IPaginatedResult } from '@ecommerce/shared';

export interface IProductCategoriesRepository {
  create(data: { name: string; slug: string; description?: string }): Promise<ICategoryResponse>;
  update(id: string, data: { name?: string; slug?: string; description?: string }): Promise<ICategoryResponse>;
  findMany(params?: { page?: number; limit?: number; level?: number }): Promise<IPaginatedResult<ICategoryResponse>>;
  findGroups(
    languageCode?: string,
    params?: { page?: number; limit?: number },
  ): Promise<IPaginatedResult<ICategoryResponse>>;
  findById(id: string, languageCode?: string): Promise<ICategoryResponse | null>;
  findTree(languageCode?: string): Promise<ICategoryResponse[]>;
  findTreeBySlug(slug: string, languageCode?: string): Promise<ICategoryResponse | null>;
  delete(id: string): Promise<ICategoryResponse>;
}

export const IProductCategoriesRepository = Symbol('IProductCategoriesRepository');
