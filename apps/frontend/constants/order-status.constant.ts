import { EOrderStatus } from "@ecommerce/shared";

export const ORDER_STATUS_CONFIG: Record<
  number,
  { label: string; color: string }
> = {
  [EOrderStatus.PENDING]: {
    label: "Pending",
    color: "text-amber-600 bg-amber-50",
  },
  [EOrderStatus.CONFIRMED]: {
    label: "Confirmed",
    color: "text-blue-600 bg-blue-50",
  },
  [EOrderStatus.PROCESSING]: {
    label: "Processing",
    color: "text-indigo-600 bg-indigo-50",
  },
  [EOrderStatus.SHIPPING]: {
    label: "Shipping",
    color: "text-sky-600 bg-sky-50",
  },
  [EOrderStatus.DELIVERED]: {
    label: "Completed",
    color: "text-emerald-600 bg-emerald-50",
  },
  [EOrderStatus.CANCELLED]: {
    label: "Cancelled",
    color: "text-gray-500 bg-gray-50",
  },
  [EOrderStatus.REFUNDED]: {
    label: "Returned/Refunded",
    color: "text-rose-600 bg-rose-50",
  },
};

export const ORDER_TABS = [
  { label: "All", value: "all" },
  {
    label: "Processing",
    value: [
      EOrderStatus.PENDING,
      EOrderStatus.CONFIRMED,
      EOrderStatus.PROCESSING,
    ],
  },
  { label: "Shipping", value: [EOrderStatus.SHIPPING] },
  { label: "Completed", value: [EOrderStatus.DELIVERED] },
  {
    label: "Cancelled",
    value: [EOrderStatus.CANCELLED, EOrderStatus.REFUNDED],
  },
] as const;
