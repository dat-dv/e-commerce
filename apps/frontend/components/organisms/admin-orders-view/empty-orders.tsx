"use client";

import Button from "@/components/atoms/button";
import { useTranslations } from "next-intl";

export function EmptyOrders({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
}) {
  const t = useTranslations("AdminOrdersPage.results");
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-md border border-content/10 px-4 text-center">
      <h2 className="text-base font-semibold text-content">
        {t("noOrdersFound")}
      </h2>
      <p className="mt-1 max-w-sm text-sm text-content/55">
        {t("noOrdersDesc")}
      </p>
      {hasFilters && (
        <Button
          type="button"
          variant="ghost"
          onClick={onClearFilters}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 h-auto opacity-100 hover:opacity-100"
        >
          {t("clearFilters")}
        </Button>
      )}
    </div>
  );
}
