import { appRequest } from "@/utils/request/request";
import { OrdersRepository } from "./infrastructure/orders.repository";
import { PlaceOrderUseCase, GetOrdersUseCase, GetOrderDetailUseCase } from "./use-cases/get-orders.use-case";

const repo = new OrdersRepository(appRequest);

export const ordersUseCase = {
  placeOrder: new PlaceOrderUseCase(repo),
  getOrders: new GetOrdersUseCase(repo),
  getOrderDetail: new GetOrderDetailUseCase(repo),
};
