import type { IApiResponse, IProductListResponse } from "@ecommerce/shared";

import { UseCase } from "@/utils/use-case";

import type { IAdminProductRepository } from "../types/product.repository";

interface IGetProductsRequest {
  page: number;
  limit: number;
  search?: string;
}

export class GetProductsUseCase extends UseCase<
  IGetProductsRequest,
  Promise<IApiResponse<IProductListResponse>>
> {
  constructor(private repository: IAdminProductRepository) {
    super();
  }

  async execute(
    request: IGetProductsRequest,
  ): Promise<IApiResponse<IProductListResponse>> {
    return this.repository.getProducts(
      request.page,
      request.limit,
      request.search,
    );
  }
}
