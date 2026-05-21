"use client";

import { Checkbox } from "@/components/atoms/checkbox";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
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
    <div
      className={cn(
        UI_RADIUS.panel,
        "border-content/[0.05] bg-surface/90 text-content/40 sticky top-[72px] z-10 flex items-center gap-4 border p-4 text-xs font-semibold shadow-sm backdrop-blur-xl md:p-6",
      )}
    >
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
