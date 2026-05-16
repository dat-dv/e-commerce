import { EOrderStatus } from "@ecommerce/shared";

export const ORDER_STATUS_CONFIG: Record<
  number,
  { label: string; color: string }
> = {
  [EOrderStatus.PENDING]: {
    label: "Pending",
    color: "text-amber-500 bg-amber-500/10",
  },
  [EOrderStatus.CONFIRMED]: {
    label: "Confirmed",
    color: "text-blue-500 bg-blue-500/10",
  },
  [EOrderStatus.PROCESSING]: {
    label: "Processing",
    color: "text-indigo-500 bg-indigo-500/10",
  },
  [EOrderStatus.SHIPPING]: {
    label: "In Transit",
    color: "text-sky-500 bg-sky-500/10",
  },
  [EOrderStatus.DELIVERED]: {
    label: "Delivered",
    color: "text-emerald-500 bg-emerald-500/10",
  },
  [EOrderStatus.CANCELLED]: {
    label: "Cancelled",
    color: "text-content/40 bg-content/10",
  },
  [EOrderStatus.REFUNDED]: {
    label: "Returned",
    color: "text-rose-500 bg-rose-500/10",
  },
};

export const ORDER_TABS = [
  { label: "Overview", value: "all" },
  {
    label: "In Progress",
    value: [
      EOrderStatus.PENDING,
      EOrderStatus.CONFIRMED,
      EOrderStatus.PROCESSING,
    ],
  },
  { label: "In Transit", value: [EOrderStatus.SHIPPING] },
  { label: "Delivered", value: [EOrderStatus.DELIVERED] },
  {
    label: "Closed",
    value: [EOrderStatus.CANCELLED, EOrderStatus.REFUNDED],
  },
] as const;
