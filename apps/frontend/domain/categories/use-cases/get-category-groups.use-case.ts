import { ICategoriesRepository } from "../types/categories.repository.interface";

export class GetCategoryGroupsUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  async execute(params?: { page?: number; limit?: number }) {
    return this.categoriesRepository.getGroups(params);
  }
}
