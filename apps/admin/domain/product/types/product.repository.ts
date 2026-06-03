import type { IApiResponse, IUpdateProductRequest } from "@ecommerce/shared";

import type { IAdminProduct, IAdminProductListResponse } from "./product.model";

export interface IAdminProductRepository {
  getProducts(
    page: number,
    limit: number,
    search?: string,
  ): Promise<IApiResponse<IAdminProductListResponse>>;

  getProduct(slug: string): Promise<IApiResponse<IAdminProduct>>;

  updateProduct(
    id: string,
    data: IUpdateProductRequest,
  ): Promise<IApiResponse<IAdminProduct>>;
}
