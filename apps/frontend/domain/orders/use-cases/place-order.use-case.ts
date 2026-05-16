import {
  IOrdersRepository,
  TPlaceOrderInput,
} from "../infrastructure/orders.repository";

export class PlaceOrderUseCase {
  constructor(private ordersRepository: IOrdersRepository) {}

  async execute(params: TPlaceOrderInput) {
    return this.ordersRepository.placeOrder(params);
  }
}
