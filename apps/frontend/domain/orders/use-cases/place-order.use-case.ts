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
