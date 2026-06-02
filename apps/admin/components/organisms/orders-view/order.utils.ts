import type { IOrderItemResponse } from "@ecommerce/shared";
import { EOrderStatus, type IOrderItemSnapshot } from "@ecommerce/shared";

export const ORDER_STATUS_MAP: Record<
  number,
  { label: string; color: string }
> = {
  [EOrderStatus.PENDING]: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-400",
  },
  [EOrderStatus.PAID]: {
    label: "Paid",
    color: "bg-blue-500/10 text-blue-400",
  },
  [EOrderStatus.SHIPPING]: {
    label: "Shipping",
    color: "bg-primary/10 text-primary",
  },
  [EOrderStatus.DELIVERED]: {
    label: "Delivered",
    color: "bg-emerald-500/10 text-emerald-400",
  },
  [EOrderStatus.CANCEL_REQUESTED]: {
    label: "Cancel Requested",
    color: "bg-orange-500/10 text-orange-400",
  },
  [EOrderStatus.CANCEL_PROCESSING]: {
    label: "Cancel Processing",
    color: "bg-orange-500/10 text-orange-400",
  },
  [EOrderStatus.CANCELLED]: {
    label: "Cancelled",
    color: "bg-red-500/10 text-red-400",
  },
  [EOrderStatus.RETURN_REQUESTED]: {
    label: "Return Requested",
    color: "bg-primary/10 text-primary",
  },
  [EOrderStatus.RETURN_PROCESSING]: {
    label: "Return Processing",
    color: "bg-primary/10 text-primary",
  },
  [EOrderStatus.RETURNED]: {
    label: "Returned",
    color: "bg-zinc-500/10 text-zinc-400",
  },
  [EOrderStatus.RETURN_REJECTED]: {
    label: "Return Rejected",
    color: "bg-red-500/10 text-red-400",
  },
};

export const getOrderStatus = (status: number) =>
  ORDER_STATUS_MAP[status] ?? {
    label: `Status ${status}`,
    color: "bg-zinc-500/10 text-zinc-400",
  };

/** @description Formats a number as VND currency. */
export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount,
  );

export const formatDate = (
  d: string | Date | null | undefined,
  opts: Intl.DateTimeFormatOptions = {},
) =>
  d
    ? new Date(d).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...opts,
      })
    : "—";

type OrderAttributeValue = string | number | boolean | null;

export const parseOrderAttributes = (attributes?: string | null) => {
  if (!attributes) return null;

  try {
    const parsed = JSON.parse(attributes) as Record<
      string,
      OrderAttributeValue
    >;
    return Object.entries(parsed)
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join(" | ");
  } catch {
    return attributes;
  }
};

const resolveOrderSnapshot = (
  snapshot: IOrderItemResponse["snapshot"],
): IOrderItemSnapshot | null => {
  if (!snapshot || typeof snapshot !== "object") return null;
  return snapshot as unknown as IOrderItemSnapshot;
};

export const getOrderItemDisplay = (
  item: IOrderItemResponse,
  fallbackProductName = "Product",
) => {
  const snapshot = resolveOrderSnapshot(item.snapshot);
  const snapshotSku = snapshot?.sku;
  const snapshotProduct = snapshotSku?.product;
  const sku = item.sku;
  const product = sku?.product;
  const productName =
    snapshotProduct?.name ||
    product?.translations?.[0]?.name ||
    product?.slug ||
    fallbackProductName;
  const image =
    snapshotSku?.image_url ||
    snapshotProduct?.thumbnail_url ||
    sku?.image_url ||
    null;
  const unitPrice = Number(snapshotSku?.price ?? item.price ?? 0);

  return {
    attributes: parseOrderAttributes(snapshotSku?.attributes),
    image,
    name: productName,
    skuCode: snapshotSku?.sku_code || sku?.sku_code || item.sku_id,
    subtotal: unitPrice * item.quantity,
    unitPrice,
  };
};
