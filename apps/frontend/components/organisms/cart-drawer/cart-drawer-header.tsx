"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface CartHeaderProps {
  count: number;
  onClose: () => void;
}

export const CartHeader = ({ count, onClose }: CartHeaderProps) => {
  const t = useTranslations("CartPage.drawer");

  return (
    <div className="flex items-center justify-between pl-4 pr-2 py-4 border-b border-content/[0.05] bg-surface/50 backdrop-blur-md">
      <Link href="/cart" className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-content">{t("title")}</h2>
        <span className="text-sm font-medium text-content/30">
          ({t("count", { count })})
        </span>
      </Link>
      <button
        onClick={onClose}
        className="w-8 h-8 flex items-center justify-center text-content/40 hover:text-content hover:bg-content/5 rounded-full transition-all"
        aria-label={t("close")}
      >
        <X size={16} aria-hidden />
      </button>
    </div>
  );
};
