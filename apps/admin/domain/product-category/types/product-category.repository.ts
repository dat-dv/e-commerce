import type { IApiResponse, ICategoryTreeResponse } from "@ecommerce/shared";

export interface IAdminProductCategoryRepository {
  getCategoryTree(): Promise<IApiResponse<ICategoryTreeResponse>>;
}
