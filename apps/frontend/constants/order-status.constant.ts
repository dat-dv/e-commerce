import { EOrderStatus } from "@ecommerce/shared";

export const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  [EOrderStatus.PENDING]: {
    label: "Pending",
    color: "text-amber-500 bg-amber-500/10",
  },
  [EOrderStatus.PAID]: {
    label: "Confirmed",
    color: "text-blue-500 bg-blue-500/10",
  },
  [EOrderStatus.SHIPPING]: {
    label: "In Transit",
    color: "text-sky-500 bg-sky-500/10",
  },
  [EOrderStatus.DELIVERED]: {
    label: "Delivered",
    color: "text-emerald-500 bg-emerald-500/10",
  },
  [EOrderStatus.CANCEL_REQUESTED]: {
    label: "Cancel Requested",
    color: "text-orange-500 bg-orange-500/10",
  },
  [EOrderStatus.CANCEL_PROCESSING]: {
    label: "Cancelling",
    color: "text-orange-400 bg-orange-400/10",
  },
  [EOrderStatus.CANCELLED]: {
    label: "Cancelled",
    color: "text-content/40 bg-content/10",
  },
  [EOrderStatus.RETURN_REQUESTED]: {
    label: "Return Requested",
    color: "text-violet-500 bg-violet-500/10",
  },
  [EOrderStatus.RETURN_PROCESSING]: {
    label: "Return Processing",
    color: "text-violet-400 bg-violet-400/10",
  },
  [EOrderStatus.RETURNED]: {
    label: "Returned",
    color: "text-rose-500 bg-rose-500/10",
  },
  [EOrderStatus.RETURN_REJECTED]: {
    label: "Return Rejected",
    color: "text-red-500 bg-red-500/10",
  },
};

export const ORDER_TABS = [
  { label: "Overview", value: "all" },
  {
    label: "In Progress",
    value: [EOrderStatus.PENDING, EOrderStatus.PAID],
  },
  { label: "In Transit", value: [EOrderStatus.SHIPPING] },
  { label: "Delivered", value: [EOrderStatus.DELIVERED] },
  {
    label: "Returns",
    value: [
      EOrderStatus.RETURN_REQUESTED,
      EOrderStatus.RETURN_PROCESSING,
      EOrderStatus.RETURNED,
      EOrderStatus.RETURN_REJECTED,
    ],
  },
  {
    label: "Closed",
    value: [
      EOrderStatus.CANCELLED,
      EOrderStatus.CANCEL_REQUESTED,
      EOrderStatus.CANCEL_PROCESSING,
    ],
  },
] as const;

export type OrderTabValue = (typeof ORDER_TABS)[number]["value"];
