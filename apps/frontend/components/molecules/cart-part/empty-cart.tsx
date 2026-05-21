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
        "bg-surface/50 border border-content/[0.05] backdrop-blur-3xl p-8 sm:p-12 lg:p-24 text-center flex flex-col items-center justify-center min-h-[50vh] relative overflow-hidden",
      )}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 blur-xl pointer-events-none" />

      <div className="bg-content/[0.02] p-8 rounded-full mb-10 border border-content/5 relative group">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <ShoppingBag
          size={64}
          className="text-content/10 relative z-10"
          aria-hidden
        />
      </div>

      <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-4 break-words">
        {t("title")}{" "}
        <span className="italic font-light opacity-30 text-content">
          {t("highlight")}
        </span>
      </h2>
      <p className="text-content/40 mb-12 max-w-xs italic font-light leading-relaxed">
        {t("description")}
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <Link
          href={APP_ROUTES.HOME}
          className={cn(
            UI_RADIUS.control,
            "bg-content text-surface hover:bg-primary hover:text-primary-foreground px-12 py-4 font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl shadow-content/20 active:scale-95",
          )}
        >
          {t("action")}
        </Link>
      </div>
    </div>
  );
};
