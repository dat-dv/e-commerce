import type { EProductSort } from "@ecommerce/shared";

import type { ApiListResponse } from "@/utils/request";
import { UseCase } from "@/utils/use-case";

import type { IAdminProduct } from "../types/product.model";
import type { IAdminProductRepository } from "../types/product.repository";

interface IGetProductsRequest {
  page: number;
  limit: number;
  search?: string;
  sort?: EProductSort;
}

export class GetProductsUseCase extends UseCase<
  IGetProductsRequest,
  Promise<ApiListResponse<IAdminProduct>>
> {
  constructor(private repository: IAdminProductRepository) {
    super();
  }

  async execute(
    request: IGetProductsRequest,
  ): Promise<ApiListResponse<IAdminProduct>> {
    return this.repository.getProducts(
      request.page,
      request.limit,
      request.search,
      request.sort,
    );
  }
}
