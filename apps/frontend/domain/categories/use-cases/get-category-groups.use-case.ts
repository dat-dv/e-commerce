import { IGetCategoryGroupsRequest } from "@ecommerce/shared";
import { ICategoriesRepository } from "../types/categories.repository.interface";

export class GetCategoryGroupsUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  async execute(query?: IGetCategoryGroupsRequest) {
    return this.categoriesRepository.getGroups(query);
  }
}
