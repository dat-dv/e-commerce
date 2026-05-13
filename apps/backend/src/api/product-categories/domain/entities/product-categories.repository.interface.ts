import { IProductCategory } from '@ecommerce/shared';
import { PaginatedResult } from 'src/shared/services/pagination/pagination.service';

export interface IProductCategoriesRepository {
  create(data: { name: string; slug: string; description?: string }): Promise<IProductCategory>;
  update(id: string, data: { name?: string; slug?: string; description?: string }): Promise<IProductCategory>;
  findMany(params?: { page?: number; limit?: number; level?: number }): Promise<PaginatedResult<IProductCategory>>;
  findGroups(
    languageCode?: string,
    params?: { page?: number; limit?: number },
  ): Promise<PaginatedResult<IProductCategory>>;
  findById(id: string, languageCode?: string): Promise<IProductCategory | null>;
  findTree(languageCode?: string): Promise<IProductCategory[]>;
  findTreeBySlug(slug: string, languageCode?: string): Promise<IProductCategory | null>;
  delete(id: string): Promise<IProductCategory>;
}

export const IProductCategoriesRepository = Symbol('IProductCategoriesRepository');
