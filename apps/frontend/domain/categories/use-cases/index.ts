import { appRequest } from "@/utils/request/request";
import { CategoriesRepository } from "../infrastructure/categories.repository";
import { GetCategoriesUseCase } from "./get-categories.use-case";

const repo = new CategoriesRepository(appRequest);

export const categoriesUseCase = {
  getCategories: new GetCategoriesUseCase(repo),
};
