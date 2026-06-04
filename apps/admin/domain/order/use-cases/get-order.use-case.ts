import type { IAdminCustomerOrder } from "@/domain/user/types/user.model";
import { UseCase } from "@/utils/use-case";

import type { IAdminOrderRepository } from "../types/order.repository";

export class GetOrderUseCase extends UseCase<
  string,
  Promise<IAdminCustomerOrder>
> {
  constructor(private repository: IAdminOrderRepository) {
    super();
  }

  async execute(id: string): Promise<IAdminCustomerOrder> {
    return this.repository.getOrder(id);
  }
}
