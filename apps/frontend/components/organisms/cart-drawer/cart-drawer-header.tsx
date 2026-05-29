"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@ecommerce/ui";

interface CartHeaderProps {
  count: number;
  onClose: () => void;
}

export const CartHeader = ({ count, onClose }: CartHeaderProps) => {
  const t = useTranslations("CartPage.drawer");

  return (
    <div className="border-content/[0.05] bg-surface/50 flex items-center justify-between border-b py-4 pr-2 pl-4 backdrop-blur-md">
      <Link href="/cart" className="flex items-center gap-2">
        <h2 className="text-content text-base font-semibold">{t("title")}</h2>
        <span className="text-content/30 text-sm font-medium">
          ({t("count", { count })})
        </span>
      </Link>
      <Button
        variant="ghost"
        onClick={onClose}
        className="text-content/40 hover:text-content hover:bg-content/5 flex h-8 w-8 items-center justify-center rounded-full p-0 transition-all active:scale-95"
        aria-label={t("close")}
      >
        <X size={16} aria-hidden />
      </Button>
    </div>
  );
};
