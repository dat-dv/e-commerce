import { EProductStatus } from "@ecommerce/shared";

/** @description Mapping of product status codes to display label and Tailwind color classes. */
export const PRODUCT_STATUS_MAP: Record<
  number,
  { label: string; color: string }
> = {
  [EProductStatus.DRAFT]: {
    label: "Draft",
    color: "bg-zinc-500/10 text-zinc-400",
  },
  [EProductStatus.ACTIVE]: {
    label: "Active",
    color: "bg-emerald-500/10 text-emerald-400",
  },
  [EProductStatus.OUT_OF_STOCK]: {
    label: "Out of Stock",
    color: "bg-red-500/10 text-red-400",
  },
};

export const getProductStatus = (status: number) =>
  PRODUCT_STATUS_MAP[status] ?? {
    label: `Status ${status}`,
    color: "bg-zinc-500/10 text-zinc-400",
  };

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount,
  );
