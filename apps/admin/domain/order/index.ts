import { AdminOrderRepository } from "./infrastructure/order.repository";
import { GetOrdersUseCase } from "./use-cases/get-orders.use-case";

export * from "./infrastructure/order.repository";
export * from "./types/order.repository";
export * from "./use-cases/get-orders.use-case";

const orderRepository = new AdminOrderRepository();

export const adminOrderUseCase = {
  getOrders: new GetOrdersUseCase(orderRepository),
};
