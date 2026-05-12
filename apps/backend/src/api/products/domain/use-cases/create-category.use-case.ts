import { Injectable, Inject } from '@nestjs/common';
import { ICategoriesRepository } from '../entities/categories.repository.interface';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(ICategoriesRepository)
    private readonly categoriesRepository: ICategoriesRepository,
  ) {}

  async execute(data: { name: string; slug: string; description?: string }) {
    return this.categoriesRepository.create(data);
  }
}
