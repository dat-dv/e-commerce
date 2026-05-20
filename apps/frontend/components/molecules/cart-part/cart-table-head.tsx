"use client";

import { Checkbox } from "@/components/atoms/checkbox";
import { useTranslations } from "next-intl";

interface CartTableHeadProps {
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
}

export const CartTableHead = ({
  isAllSelected,
  onToggleSelectAll,
}: CartTableHeadProps) => {
  const t = useTranslations("CartPage.table");

  return (
    <div className="sticky top-[72px] z-10 flex items-center gap-4 rounded-2xl border border-content/[0.05] bg-surface/90 p-4 text-xs font-semibold text-content/40 shadow-sm backdrop-blur-xl md:p-6">
      <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
        <Checkbox checked={isAllSelected} onCheckedChange={onToggleSelectAll} />
        <span className="truncate md:ml-2">{t("product")}</span>
      </div>
      <div className="hidden w-32 text-center md:block">{t("unitPrice")}</div>
      <div className="hidden w-32 text-center md:block">{t("quantity")}</div>
      <div className="hidden w-32 text-center md:block">{t("total")}</div>
      <div className="hidden w-24 text-center md:block">{t("action")}</div>
    </div>
  );
};
