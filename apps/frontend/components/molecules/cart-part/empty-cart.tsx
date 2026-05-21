"use client";

import { APP_ROUTES } from "@/constants/routes";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const EmptyCart = () => {
  const t = useTranslations("CartPage.empty");

  return (
    <div
      className={cn(
        UI_RADIUS.panel,
        "bg-surface/50 border-content/[0.05] relative flex min-h-[50vh] flex-col items-center justify-center overflow-hidden border p-8 text-center backdrop-blur-3xl sm:p-12 lg:p-24",
      )}
    >
      <div className="bg-primary/20 pointer-events-none absolute top-0 left-0 h-1 w-full blur-xl" />

      <div className="bg-content/[0.02] border-content/5 group relative mb-10 rounded-full border p-8">
        <div className="bg-primary/5 absolute inset-0 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
        <ShoppingBag
          size={64}
          className="text-content/10 relative z-10"
          aria-hidden
        />
      </div>

      <h2 className="mb-4 text-2xl font-black tracking-tight break-words uppercase sm:text-3xl">
        {t("title")}{" "}
        <span className="text-content font-light italic opacity-30">
          {t("highlight")}
        </span>
      </h2>
      <p className="text-content/40 mb-12 max-w-xs leading-relaxed font-light italic">
        {t("description")}
      </p>

      <div className="flex flex-col gap-6 sm:flex-row">
        <Link
          href={APP_ROUTES.HOME}
          className={cn(
            UI_RADIUS.control,
            "bg-content text-surface hover:bg-primary hover:text-primary-foreground shadow-content/20 px-12 py-4 text-sm font-black tracking-[0.3em] uppercase shadow-2xl transition-all active:scale-95",
          )}
        >
          {t("action")}
        </Link>
      </div>
    </div>
  );
};
