import {
  IOrdersRepository,
  IPlaceOrderParams,
} from "../infrastructure/orders.repository";

export class PlaceOrderUseCase {
  constructor(private ordersRepository: IOrdersRepository) {}
  async execute(params: IPlaceOrderParams) {
    return this.ordersRepository.placeOrder(params);
  }
}

export class GetOrdersUseCase {
  constructor(private ordersRepository: IOrdersRepository) {}
  async execute(params?: { status?: number[]; page?: number; limit?: number }) {
    return this.ordersRepository.getOrders(params);
  }
}

export class GetOrderDetailUseCase {
  constructor(private ordersRepository: IOrdersRepository) {}
  async execute(id: string) {
    return this.ordersRepository.getOrderDetail(id);
  }
}
