enum EAdminOrderStatus {
  PENDING = 300,
  PAID = 301,
  SHIPPING = 302,
  DELIVERED = 303,
  CANCEL_REQUESTED = 304,
  CANCEL_PROCESSING = 305,
  CANCELLED = 306,
  RETURN_REQUESTED = 307,
  RETURN_PROCESSING = 308,
  RETURNED = 309,
  RETURN_REJECTED = 310,
}

export const ORDER_STATUS_MAP: Record<
  number,
  { label: string; color: string }
> = {
  [EAdminOrderStatus.PENDING]: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-400",
  },
  [EAdminOrderStatus.PAID]: {
    label: "Paid",
    color: "bg-blue-500/10 text-blue-400",
  },
  [EAdminOrderStatus.SHIPPING]: {
    label: "Shipping",
    color: "bg-primary/10 text-primary",
  },
  [EAdminOrderStatus.DELIVERED]: {
    label: "Delivered",
    color: "bg-emerald-500/10 text-emerald-400",
  },
  [EAdminOrderStatus.CANCEL_REQUESTED]: {
    label: "Cancel Requested",
    color: "bg-orange-500/10 text-orange-400",
  },
  [EAdminOrderStatus.CANCEL_PROCESSING]: {
    label: "Cancel Processing",
    color: "bg-orange-500/10 text-orange-400",
  },
  [EAdminOrderStatus.CANCELLED]: {
    label: "Cancelled",
    color: "bg-red-500/10 text-red-400",
  },
  [EAdminOrderStatus.RETURN_REQUESTED]: {
    label: "Return Requested",
    color: "bg-primary/10 text-primary",
  },
  [EAdminOrderStatus.RETURN_PROCESSING]: {
    label: "Return Processing",
    color: "bg-primary/10 text-primary",
  },
  [EAdminOrderStatus.RETURNED]: {
    label: "Returned",
    color: "bg-zinc-500/10 text-zinc-400",
  },
  [EAdminOrderStatus.RETURN_REJECTED]: {
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
