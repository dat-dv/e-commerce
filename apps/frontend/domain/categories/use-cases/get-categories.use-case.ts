import { IGetAllCategoriesRequest } from "@ecommerce/shared";
import { ICategoriesRepository } from "../types/categories.repository.interface";

export class GetCategoriesUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  async execute(query?: IGetAllCategoriesRequest) {
    return this.categoriesRepository.getCategories(query);
  }
}
