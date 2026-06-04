import type { EOrderStatus } from "@ecommerce/shared";

import type { IAdminCustomerOrder } from "@/domain/user/types/user.model";
import { UseCase } from "@/utils/use-case";

import type { IAdminOrderRepository } from "../types/order.repository";

export interface IAdminUpdateOrderStatusRequest {
  id: string;
  status: EOrderStatus;
}

export class UpdateOrderStatusUseCase extends UseCase<
  IAdminUpdateOrderStatusRequest,
  Promise<IAdminCustomerOrder>
> {
  constructor(private repository: IAdminOrderRepository) {
    super();
  }

  async execute(
    request: IAdminUpdateOrderStatusRequest,
  ): Promise<IAdminCustomerOrder> {
    return this.repository.updateStatus(request.id, request.status);
  }
}
