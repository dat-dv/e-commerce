import { Order, OrderItem } from 'generated/prisma/client';

export interface IOrdersRepository {
  createOrder(data: {
    user_id: string;
    total_amount: number;
    shipping_address_id?: string;
    items: { sku_id: string; quantity: number; price: number }[];
  }): Promise<Order & { items: OrderItem[] }>;
  getOrder(id: string): Promise<(Order & { items: OrderItem[] }) | null>;
  getUserOrders(userId: string): Promise<Order[]>;
  updateStatus(id: string, status: number): Promise<Order>;
}

export const IOrdersRepository = Symbol('IOrdersRepository');
