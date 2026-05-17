"use client";

import { formatCurrency } from "@/utils/format-currency";

interface CartSummaryProps {
  itemCount: number;
  selectedCount: number;
  totalAmount: number;
}

const CartSummaryCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="rounded-2xl border border-content/[0.06] bg-content/[0.02] p-4">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-content/35">
      {label}
    </p>
    <p className="mt-2 text-2xl font-black text-content">{value}</p>
  </div>
);

export const CartSummary = ({
  itemCount,
  selectedCount,
  totalAmount,
}: CartSummaryProps) => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
      <CartSummaryCard label="Cart Items" value={itemCount} />
      <CartSummaryCard label="Selected" value={selectedCount} />
      <CartSummaryCard label="Subtotal" value={formatCurrency(totalAmount)} />
    </div>
  );
};
