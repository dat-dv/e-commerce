"use client";

import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format-currency";
import { ChevronRight, Ticket } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface CartFooterProps {
  selectedCount: number;
  totalAmount: number;
}

export const CartFooter = ({ selectedCount, totalAmount }: CartFooterProps) => {
  const t = useTranslations("CartPage.footer");

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-3xl border-t border-content/[0.05] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-40 overflow-hidden mt-12 mb-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-primary/30 blur-md pointer-events-none" />

      <div className="bg-primary/[0.1] border-b border-primary/5 px-8 py-3 flex items-center justify-center md:justify-end gap-8 text-xs font-medium">
        <Button
          variant="ghost"
          className="text-content/70 hover:text-primary flex items-center gap-2 group h-auto px-0"
        >
          <Ticket size={14} className="text-primary/60" aria-hidden />
          {t("applyCoupon")}{" "}
          <ChevronRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
            aria-hidden
          />
        </Button>
      </div>

      <div className="container mx-auto max-w-7xl px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-6 relative">
        <div className="flex items-center gap-10">
          <div className="hidden md:block">
            <div className="text-xs font-semibold text-content/40 mb-1">
              {t("summary")}
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-content/60">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {t("selected", { count: String(selectedCount) })}
              </span>
              <span className="w-px h-3 bg-content/10" />
              <span className="text-emerald-500">{t("freeShipping")}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <div className="text-xs font-semibold text-content/40 mb-1">
              {t("subtotal")}
            </div>
            <div className="text-2xl md:text-3xl font-black text-content tracking-tight leading-none">
              {formatCurrency(totalAmount)}
            </div>
          </div>

          <Link
            href={selectedCount > 0 ? APP_ROUTES.CHECKOUT : "#"}
            className={cn(
              "px-10 h-12 flex items-center justify-center rounded-xl font-bold text-sm transition-all relative overflow-hidden group",
              selectedCount > 0
                ? "bg-primary text-surface shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98]"
                : "bg-content/[0.05] text-content/20 cursor-not-allowed",
            )}
            onClick={(e) => selectedCount === 0 && e.preventDefault()}
          >
            {t("checkout")}
            <ChevronRight
              size={18}
              className="ml-2 group-hover:translate-x-1 transition-transform"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
