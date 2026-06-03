import type { IAdminCategory } from "@/domain/product";
import { UseCase } from "@/utils/use-case";

import type { IAdminProductCategoryRepository } from "../types/product-category.repository";

export class GetCategoryTreeUseCase extends UseCase<
  void,
  Promise<IAdminCategory[]>
> {
  constructor(private repository: IAdminProductCategoryRepository) {
    super();
  }

  async execute(): Promise<IAdminCategory[]> {
    return this.repository.getCategoryTree();
  }
}
