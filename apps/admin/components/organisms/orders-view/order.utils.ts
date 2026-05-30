import { EOrderStatus } from "@ecommerce/shared";

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
    color: "bg-indigo-500/10 text-indigo-400",
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
    color: "bg-purple-500/10 text-purple-400",
  },
  [EOrderStatus.RETURN_PROCESSING]: {
    label: "Return Processing",
    color: "bg-purple-500/10 text-purple-400",
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
