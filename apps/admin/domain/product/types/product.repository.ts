import type { IUpdateProductRequest } from "@ecommerce/shared";

import type { ApiListResponse } from "@/utils/request";

import type { IAdminProduct } from "./product.model";

export interface IAdminProductRepository {
  getProducts(
    page: number,
    limit: number,
    search?: string,
  ): Promise<ApiListResponse<IAdminProduct>>;

  getProduct(slug: string): Promise<IAdminProduct>;

  updateProduct(
    id: string,
    data: IUpdateProductRequest,
  ): Promise<IAdminProduct>;
}
