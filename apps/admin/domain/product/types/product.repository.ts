import type { IApiResponse, IProductListResponse } from "@ecommerce/shared";

export interface IAdminProductRepository {
  getProducts(
    page: number,
    limit: number,
  ): Promise<IApiResponse<IProductListResponse>>;
}
