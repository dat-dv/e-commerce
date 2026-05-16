import { IOrdersRepository } from "../infrastructure/orders.repository";
import { TPlaceOrderRequest } from "../types/order.model";

export class PlaceOrderUseCase {
  constructor(private ordersRepository: IOrdersRepository) {}

  async execute(params: TPlaceOrderRequest) {
    return this.ordersRepository.placeOrder(params);
  }
}
