import { parseOrderAttributes } from "@/components/molecules/order-part/order-display.utils";
import { ORDER_STATUS_CONFIG } from "@/constants/order-status.constant";
import { TOrder } from "@/domain/orders/types/order.model";
import { EOrderStatus } from "@ecommerce/shared";

export const STATUS_VALUES = Object.keys(ORDER_STATUS_CONFIG).map(
  (value) => Number(value) as EOrderStatus,
);

export const getOrderPreview = (order: TOrder, fallbackProductName: string) => {
  const firstItem = order.items[0];
  const snap = firstItem?.snapshot;

  return {
    image: snap?.sku?.image_url || "/images/placeholder.png",
    name: snap?.sku?.product?.name || fallbackProductName,
    attributes: parseOrderAttributes(snap?.sku?.attributes),
    extraCount: Math.max(order.items.length - 1, 0),
    quantity: order.items.reduce((total, item) => total + item.quantity, 0),
  };
};

export type OrderPreviewData = ReturnType<typeof getOrderPreview>;
