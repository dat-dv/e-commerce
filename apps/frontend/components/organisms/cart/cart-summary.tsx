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

  const summaryItems = [
    {
      label: t("items"),
      value: itemCount,
      icon: ShoppingBag,
      valueClassName: "text-2xl md:text-4xl",
    },
    {
      label: t("selected"),
      value: selectedCount,
      icon: ShoppingCart,
      valueClassName: "text-2xl md:text-4xl",
    },
    {
      label: t("subtotal"),
      value: formatCurrency(totalAmount),
      icon: ShoppingCart,
      valueClassName: "text-xl md:text-4xl",
    },
  ];

  return (
    <div className="flex gap-3 sm:grid sm:grid-cols-3 sm:gap-4 mb-4">
      {summaryItems.map(({ label, value, icon }) => (
        <SummaryCard
          key={label}
          label={label}
          value={value}
          icon={icon}
          className="
        w-[160px]
        shrink-0
        min-h-[88px]
        rounded-2xl
        p-3

        sm:min-h-[120px]
        sm:w-auto
        sm:rounded-3xl
        sm:p-5
      "
          contentClassName="gap-4"
          labelClassName="
        truncate
        text-[10px]
        tracking-[0.12em]

        sm:text-xs
        sm:tracking-[0.18em]
      "
          valueClassName="
        mt-2
        text-2xl

        sm:mt-3
        sm:text-4xl
      "
          iconWrapperClassName="
        size-8
        rounded-xl

        sm:size-11
        sm:rounded-2xl
      "
          iconClassName="size-4 sm:size-5"
        />
      ))}
    </div>
  );
};
