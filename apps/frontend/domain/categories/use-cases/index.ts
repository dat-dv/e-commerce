import { appRequest } from "@/constants/app-request";
import { CategoriesRepository } from "../infrastructure/categories.repository";
import { GetCategoriesUseCase } from "./get-categories.use-case";
import { GetCategoryGroupsUseCase } from "./get-category-groups.use-case";
import { GetCategoryTreeUseCase } from "./get-category-tree.use-case";

const repo = new CategoriesRepository(appRequest);

export const categoriesUseCase = {
  getCategories: new GetCategoriesUseCase(repo),
  getGroups: new GetCategoryGroupsUseCase(repo),
  getTree: new GetCategoryTreeUseCase(repo),
};
