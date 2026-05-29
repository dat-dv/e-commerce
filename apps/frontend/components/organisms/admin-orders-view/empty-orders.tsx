"use client";

import { Button } from "@ecommerce/ui";
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
    <div className="border-content/10 flex min-h-60 flex-col items-center justify-center rounded-md border px-4 text-center">
      <h2 className="text-content text-base font-semibold">
        {t("noOrdersFound")}
      </h2>
      <p className="text-content/55 mt-1 max-w-sm text-sm">
        {t("noOrdersDesc")}
      </p>
      {hasFilters && (
        <Button
          type="button"
          variant="ghost"
          onClick={onClearFilters}
          className="bg-primary hover:bg-primary/90 focus-visible:ring-primary/40 mt-4 h-auto rounded-md px-4 py-2 text-sm font-semibold text-white opacity-100 hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
        >
          {t("clearFilters")}
        </Button>
      )}
    </div>
  );
}
