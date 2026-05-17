"use client";

import SummaryCard from "@/components/molecules/summary-card";
import { formatCurrency } from "@/utils/format-currency";
import { ShoppingBag, ShoppingCart } from "lucide-react";

interface CartSummaryProps {
  itemCount: number;
  selectedCount: number;
  totalAmount: number;
}

export const CartSummary = ({
  itemCount,
  selectedCount,
  totalAmount,
}: CartSummaryProps) => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
      <SummaryCard label="Cart Items" value={itemCount} icon={ShoppingBag} />
      <SummaryCard label="Selected" value={selectedCount} icon={ShoppingCart} />
      <SummaryCard
        label="Subtotal"
        value={formatCurrency(totalAmount)}
        icon={ShoppingCart}
      />
    </div>
  );
};
