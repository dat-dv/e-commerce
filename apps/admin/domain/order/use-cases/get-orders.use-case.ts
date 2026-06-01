import type { IApiResponse, IOrderResponse } from "@ecommerce/shared";

import type { ApiListResponse } from "@/utils/request";
import { UseCase } from "@/utils/use-case";

import type { IAdminOrderRepository } from "../types/order.repository";

interface IGetOrdersRequest {
  page: number;
  limit: number;
  search?: string;
}

export class GetOrdersUseCase extends UseCase<
  IGetOrdersRequest,
  Promise<IApiResponse<ApiListResponse<IOrderResponse>>>
> {
  constructor(private repository: IAdminOrderRepository) {
    super();
  }

  async execute(
    request: IGetOrdersRequest,
  ): Promise<IApiResponse<ApiListResponse<IOrderResponse>>> {
    return this.repository.getOrders(
      request.page,
      request.limit,
      undefined,
      request.search,
    );
  }
}
