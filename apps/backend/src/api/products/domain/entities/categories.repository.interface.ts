import { Category } from 'generated/prisma/client';

export interface ICategoriesRepository {
  create(data: { name: string; slug: string; description?: string }): Promise<Category>;
}

export const ICategoriesRepository = Symbol('ICategoriesRepository');
