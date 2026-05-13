import { ICategoriesRepository } from "../types/categories.repository.interface";

export class GetCategoriesUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  async execute(params?: { page?: number; limit?: number; level?: number }) {
    return this.categoriesRepository.getCategories(params);
  }
}
