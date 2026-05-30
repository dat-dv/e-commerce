import type { IApiResponse, ICategoryTreeResponse } from "@ecommerce/shared";

import { UseCase } from "@/utils/use-case";

import type { IAdminProductCategoryRepository } from "../types/product-category.repository";

export class GetCategoryTreeUseCase extends UseCase<
  void,
  Promise<IApiResponse<ICategoryTreeResponse>>
> {
  constructor(private repository: IAdminProductCategoryRepository) {
    super();
  }

  async execute(): Promise<IApiResponse<ICategoryTreeResponse>> {
    return this.repository.getCategoryTree();
  }
}
