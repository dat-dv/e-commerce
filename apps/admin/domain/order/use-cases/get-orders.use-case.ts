import type { IAdminCustomerOrder } from "@/domain/user/types/user.model";
import type { ApiListResponse } from "@/utils/request";
import { UseCase } from "@/utils/use-case";

import type { IAdminOrderRepository } from "../types/order.repository";

export interface IAdminGetOrdersRequest {
  page: number;
  limit: number;
  search?: string;
}

export class GetOrdersUseCase extends UseCase<
  IAdminGetOrdersRequest,
  Promise<ApiListResponse<IAdminCustomerOrder>>
> {
  constructor(private repository: IAdminOrderRepository) {
    super();
  }

  async execute(
    request: IAdminGetOrdersRequest,
  ): Promise<ApiListResponse<IAdminCustomerOrder>> {
    return this.repository.getOrders({
      page: request.page,
      limit: request.limit,
      search: request.search,
    });
  }
}
