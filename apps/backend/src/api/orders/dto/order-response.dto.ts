import { IOrder, IOrderItem } from '@ecommerce/shared';

type PrismaOrderItem = Omit<IOrderItem, 'snapshot'> & { snapshot?: unknown };
type PrismaOrder = Omit<IOrder, 'items'> & {
  items?: PrismaOrderItem[];
  shipping_address?: unknown;
};

export class OrderResponseDto {
  static toDto(order: PrismaOrder | null | undefined): IOrder | null {
    if (!order) return null;

    return {
      ...order,
      items: (order.items ?? []).map(
        (item): IOrderItem => ({
          ...item,

          snapshot: item.snapshot,
        }),
      ),
    };
  }

  static toDtos(orders: PrismaOrder[]): IOrder[] {
    return orders.map((order) => this.toDto(order) as IOrder);
  }
}
