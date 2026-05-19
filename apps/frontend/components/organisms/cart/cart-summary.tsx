"use client";

import SummaryCard from "@/components/molecules/summary-card";
import { formatCurrency } from "@/utils/format-currency";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("CartPage.summary");

  return (
    <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
      <SummaryCard label={t("items")} value={itemCount} icon={ShoppingBag} />
      <SummaryCard
        label={t("selected")}
        value={selectedCount}
        icon={ShoppingCart}
      />
      <SummaryCard
        label={t("subtotal")}
        value={formatCurrency(totalAmount)}
        icon={ShoppingCart}
      />
    </div>
  );
};
