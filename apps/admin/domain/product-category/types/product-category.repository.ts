import type { IApiResponse } from "@ecommerce/shared";

import type { IAdminCategory } from "@/domain/product";

export interface IAdminProductCategoryRepository {
  getCategoryTree(): Promise<IApiResponse<IAdminCategory[]>>;
}
