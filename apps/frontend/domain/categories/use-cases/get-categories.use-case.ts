import { ICategoriesRepository } from "../entities/categories.repository.interface";

export class GetCategoriesUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  async execute(params?: { page?: number; limit?: number }) {
    return this.categoriesRepository.getCategories(params);
  }
}
