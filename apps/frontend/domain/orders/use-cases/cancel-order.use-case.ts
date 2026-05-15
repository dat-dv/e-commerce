import { IOrdersRepository } from "../infrastructure/orders.repository";

export class CancelOrderUseCase {
  constructor(private ordersRepository: IOrdersRepository) {}

  async execute(orderId: string) {
    return this.ordersRepository.cancelOrder(orderId);
  }
}
