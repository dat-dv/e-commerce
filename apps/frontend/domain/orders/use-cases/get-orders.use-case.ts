import { IOrdersRepository } from "../infrastructure/orders.repository";
import { TGetOrdersRequest } from "../types/order.model";

export class GetOrdersUseCase {
  constructor(private ordersRepository: IOrdersRepository) {}
  async execute(params?: TGetOrdersRequest) {
    return this.ordersRepository.getOrders(params);
  }
}

export class GetOrderDetailUseCase {
  constructor(private ordersRepository: IOrdersRepository) {}
  async execute(id: string) {
    return this.ordersRepository.getOrderDetail(id);
  }
}
