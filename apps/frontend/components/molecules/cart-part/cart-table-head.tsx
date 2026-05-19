"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/atoms/checkbox";

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
    <div className="bg-surface/50 backdrop-blur-xl sticky top-[72px] z-10 border border-content/[0.05] rounded-2xl p-6 shadow-sm hidden md:flex items-center gap-4 text-xs font-semibold text-content/40">
      <div className="flex items-center gap-4 flex-1">
        <Checkbox checked={isAllSelected} onCheckedChange={onToggleSelectAll} />
        <span className="ml-2">{t("product")}</span>
      </div>
      <div className="w-32 text-center">{t("unitPrice")}</div>
      <div className="w-32 text-center">{t("quantity")}</div>
      <div className="w-32 text-center">{t("total")}</div>
      <div className="w-24 text-center">{t("action")}</div>
    </div>
  );
};
