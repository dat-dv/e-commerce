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
    <div className="sticky bottom-0 left-0 right-0 z-40 mt-8 mb-4 overflow-hidden rounded-t-2xl border-t border-content/[0.05] bg-surface/95 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] backdrop-blur-3xl md:mt-12 md:mb-8 md:rounded-t-none">
      <div className="pointer-events-none absolute left-1/2 top-0 h-1 w-1/2 -translate-x-1/2 bg-primary/30 blur-md" />

      <div className="flex items-center justify-center gap-8 border-b border-primary/5 bg-primary/[0.1] px-4 py-2.5 text-xs font-medium md:justify-end md:px-8 md:py-3">
        <Button
          variant="ghost"
          className="group flex h-auto items-center gap-2 px-0 text-content/70 hover:text-primary"
        >
          <Ticket size={14} className="text-primary/60" aria-hidden />
          {t("applyCoupon")}{" "}
          <ChevronRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </Button>
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-stretch justify-between gap-4 px-4 py-4 md:flex-row md:items-center md:gap-6 md:px-8 md:py-5">
        <div className="flex items-center gap-10">
          <div className="hidden md:block">
            <div className="mb-1 text-xs font-semibold text-content/40">
              {t("summary")}
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-content/60">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t("selected", { count: String(selectedCount) })}
              </span>
              <span className="h-3 w-px bg-content/10" />
              <span className="text-emerald-500">{t("freeShipping")}</span>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-end md:gap-8">
          <div className="min-w-0 text-left md:text-right">
            <div className="mb-1 text-xs font-semibold text-content/40">
              {t("subtotal")}
            </div>
            <div className="truncate text-xl font-black leading-none tracking-tight text-content sm:text-2xl md:text-3xl">
              {formatCurrency(totalAmount)}
            </div>
          </div>

          <Link
            href={selectedCount > 0 ? APP_ROUTES.CHECKOUT : "#"}
            className={cn(
              "group relative flex h-11 shrink-0 items-center justify-center overflow-hidden rounded-xl px-5 text-sm font-bold transition-all sm:h-12 sm:px-10",
              selectedCount > 0
                ? "bg-primary text-surface shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98]"
                : "bg-content/[0.05] text-content/20 cursor-not-allowed",
            )}
            onClick={(e) => selectedCount === 0 && e.preventDefault()}
          >
            {t("checkout")}
            <ChevronRight
              size={18}
              className="ml-2 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
