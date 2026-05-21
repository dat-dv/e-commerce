"use client";

import SummaryCard from "@/components/molecules/summary-card";
import { TYPOGRAPHY } from "@/constants/typography";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
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
    <div className="mb-4 flex gap-3 overflow-x-auto sm:grid sm:grid-cols-3 sm:gap-4">
      {summaryItems.map(({ label, value, icon, valueClassName }) => (
        <SummaryCard
          key={label}
          label={label}
          value={value}
          icon={icon}
          className={cn(
            UI_RADIUS.card,
            "w-[160px] shrink-0 min-h-[88px] p-3 sm:min-h-[120px] sm:w-auto sm:p-5",
          )}
          contentClassName="gap-4"
          labelClassName={`truncate ${TYPOGRAPHY.badge} tracking-[0.12em] sm:${TYPOGRAPHY.caption} sm:tracking-[0.18em]`}
          valueClassName={cn("mt-2 sm:mt-3", valueClassName)}
          iconWrapperClassName={cn(UI_RADIUS.media, "size-8 sm:size-11")}
          iconClassName="size-4 sm:size-5"
        />
      ))}
    </div>
  );
};
