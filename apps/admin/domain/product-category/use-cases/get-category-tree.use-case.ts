import type { IApiResponse } from "@ecommerce/shared";

import type { IAdminCategory } from "@/domain/product";
import { UseCase } from "@/utils/use-case";

import type { IAdminProductCategoryRepository } from "../types/product-category.repository";

export class GetCategoryTreeUseCase extends UseCase<
  void,
  Promise<IApiResponse<IAdminCategory[]>>
> {
  constructor(private repository: IAdminProductCategoryRepository) {
    super();
  }

  async execute(): Promise<IApiResponse<IAdminCategory[]>> {
    return this.repository.getCategoryTree();
  }
}
