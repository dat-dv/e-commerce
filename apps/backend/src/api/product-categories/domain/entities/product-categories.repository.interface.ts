import { ProductCategory } from 'generated/prisma/client';

export interface IProductCategoriesRepository {
  create(data: { name: string; slug: string; description?: string }): Promise<ProductCategory>;
  update(id: string, data: { name?: string; slug?: string; description?: string }): Promise<ProductCategory>;
  findAll(): Promise<ProductCategory[]>;
  delete(id: string): Promise<ProductCategory>;
}

export const IProductCategoriesRepository = Symbol('IProductCategoriesRepository');
