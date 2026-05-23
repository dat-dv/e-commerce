import { appRequest } from "@/constants/app-request";
import { OrdersRepository } from "./infrastructure/orders.repository";
import { CancelOrderUseCase } from "./use-cases/cancel-order.use-case";
import {
  GetOrderDetailUseCase,
  GetOrdersByAdminUseCase,
  GetOrdersUseCase,
  UpdateOrderStatusByAdminUseCase,
} from "./use-cases/get-orders.use-case";
import { PlaceOrderUseCase } from "./use-cases/place-order.use-case";

const repo = new OrdersRepository(appRequest);

export const ordersUseCase = {
  placeOrder: new PlaceOrderUseCase(repo),
  getOrders: new GetOrdersUseCase(repo),
  getOrderDetail: new GetOrderDetailUseCase(repo),
  cancelOrder: new CancelOrderUseCase(repo),
  getOrdersByAdmin: new GetOrdersByAdminUseCase(repo),
  updateOrderStatusByAdmin: new UpdateOrderStatusByAdminUseCase(repo),
};
