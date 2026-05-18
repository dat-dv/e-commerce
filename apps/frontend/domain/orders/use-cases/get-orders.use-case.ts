import { IOrdersRepository } from "../infrastructure/orders.repository";
import {
  TGetOrdersRequest,
  TGetOrdersByAdminRequest,
} from "../types/order.model";

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

export class GetOrdersByAdminUseCase {
  constructor(private ordersRepository: IOrdersRepository) {}
  async execute(params?: TGetOrdersByAdminRequest) {
    return this.ordersRepository.getOrdersByAdmin(params);
  }
}

export class UpdateOrderStatusByAdminUseCase {
  constructor(private ordersRepository: IOrdersRepository) {}
  async execute(id: string, status: number) {
    return this.ordersRepository.updateOrderStatusByAdmin(id, status);
  }
}
