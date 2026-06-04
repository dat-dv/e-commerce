import { EOrderStatus } from "@ecommerce/shared";

import type {
  IAdminCustomerOrder,
  IAdminOrderItem,
} from "@/domain/user/types/user.model";

type SnapshotSku = {
  sku?: {
    image_url?: string | null;
    sku_code?: string | null;
    attributes?: string | null;
    product?: {
      name?: string | null;
      thumbnail_url?: string | null;
    };
  };
};

export const STATUS_FLOW = [
  EOrderStatus.PENDING,
  EOrderStatus.PAID,
  EOrderStatus.SHIPPING,
  EOrderStatus.DELIVERED,
];

const getSnapshot = (item: IAdminOrderItem): SnapshotSku =>
  item.snapshot && typeof item.snapshot === "object"
    ? (item.snapshot as SnapshotSku)
    : {};

export const getItemName = (item: IAdminOrderItem) => {
  const snapshot = getSnapshot(item);
  return (
    snapshot.sku?.product?.name ||
    item.sku?.product?.translations?.[0]?.name ||
    item.sku?.skuCode ||
    "Product item"
  );
};

export const getItemImage = (item: IAdminOrderItem) => {
  const snapshot = getSnapshot(item);
  return (
    snapshot.sku?.image_url ||
    snapshot.sku?.product?.thumbnail_url ||
    item.sku?.imageUrl ||
    item.sku?.product?.thumbnail?.url ||
    null
  );
};

export const getItemAttributes = (item: IAdminOrderItem) => {
  const snapshot = getSnapshot(item);
  if (snapshot.sku?.attributes) return snapshot.sku.attributes;

  return (
    item.sku?.skuAttributeValues
      ?.map((entry) => entry.attributeValue?.value)
      .filter(Boolean)
      .join(" / ") || "Default variant"
  );
};

export const getCustomerName = (order: IAdminCustomerOrder) =>
  [order.user?.firstName, order.user?.lastName].filter(Boolean).join(" ") ||
  order.user?.email ||
  "Unknown customer";

export const getShippingAddress = (order: IAdminCustomerOrder) =>
  order.shippingAddress
    ? [
        order.shippingAddress.street,
        order.shippingAddress.city,
        order.shippingAddress.state,
        order.shippingAddress.country,
        order.shippingAddress.postalCode,
      ]
        .filter(Boolean)
        .join(", ")
    : "No shipping address";
