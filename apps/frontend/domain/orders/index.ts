import { appRequest } from "@/utils/request/request";
import { OrdersRepository } from "./infrastructure/orders.repository";
import { PlaceOrderUseCase } from "./use-cases/place-order.use-case";
import {
  GetOrdersUseCase,
  GetOrderDetailUseCase,
  GetOrdersByAdminUseCase,
  UpdateOrderStatusByAdminUseCase,
} from "./use-cases/get-orders.use-case";
import { CancelOrderUseCase } from "./use-cases/cancel-order.use-case";

const repo = new OrdersRepository(appRequest);

export const ordersUseCase = {
  placeOrder: new PlaceOrderUseCase(repo),
  getOrders: new GetOrdersUseCase(repo),
  getOrderDetail: new GetOrderDetailUseCase(repo),
  cancelOrder: new CancelOrderUseCase(repo),
  getOrdersByAdmin: new GetOrdersByAdminUseCase(repo),
  updateOrderStatusByAdmin: new UpdateOrderStatusByAdminUseCase(repo),
};
