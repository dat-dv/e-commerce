import { AdminOrderRepository } from "./infrastructure/order.repository";
import { GetOrderUseCase } from "./use-cases/get-order.use-case";
import { GetOrdersUseCase } from "./use-cases/get-orders.use-case";
import { UpdateOrderStatusUseCase } from "./use-cases/update-order-status.use-case";

export * from "./infrastructure/order.repository";
export * from "./types/order.repository";
export * from "./use-cases/get-order.use-case";
export * from "./use-cases/get-orders.use-case";
export * from "./use-cases/update-order-status.use-case";

const orderRepository = new AdminOrderRepository();

export const adminOrderUseCase = {
  getOrder: new GetOrderUseCase(orderRepository),
  getOrders: new GetOrdersUseCase(orderRepository),
  updateStatus: new UpdateOrderStatusUseCase(orderRepository),
};
