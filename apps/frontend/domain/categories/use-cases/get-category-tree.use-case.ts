import { ICategoriesRepository } from "../entities/categories.repository.interface";

export class GetCategoryTreeUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  async execute() {
    return this.categoriesRepository.getTree();
  }
}
