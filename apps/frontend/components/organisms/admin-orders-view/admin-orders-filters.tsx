"use client";

import Button from "@/components/atoms/button";
import SearchInput from "@/components/molecules/search-input";
import { cn } from "@/utils/cn";
import { FilterX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

import { getOrderStatusLabel } from "@/utils/order";
import { STATUS_VALUES } from "./admin-orders.utils";

export function AdminOrdersFilters({
  search,
  selectedStatuses,
  loading,
  hasFilters,
  onSearch,
  onStatusFilterToggle,
  onClearFilters,
}: {
  search: string;
  selectedStatuses: number[];
  loading: boolean;
  hasFilters: boolean;
  onSearch: (value: string) => void;
  onStatusFilterToggle: (status: number) => void;
  onClearFilters: () => void;
}) {
  const t = useTranslations("AdminOrdersPage");
  const tStatus = useTranslations("OrderStatus");

  const getStatusLabel = useCallback(
    (status: number) => {
      const label = getOrderStatusLabel(status, tStatus);
      return label === String(status) ? t("results.unknown") : label;
    },
    [t, tStatus],
  );

  const statusOptions = useMemo(() => {
    return STATUS_VALUES.map((value) => ({
      value,
      label: getStatusLabel(value),
    }));
  }, [getStatusLabel]);

  return (
    <section
      aria-label={t("filters.ariaLabel")}
      className="border-content/[0.08] flex flex-col gap-6 border-b pb-6"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <label
            htmlFor="admin-order-search"
            className="text-content/45 mb-2.5 block text-xs font-bold tracking-wider uppercase"
          >
            {t("filters.searchLabel")}
          </label>
          <SearchInput
            id="admin-order-search"
            value={search}
            onSearch={onSearch}
            placeholder={t("filters.searchPlaceholder")}
            loading={loading}
            className="bg-surface/40 border-content/10 focus-within:border-primary/30 w-full border backdrop-blur-md"
          />
        </div>

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={onClearFilters}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-transparent bg-rose-500/10 px-4 text-sm font-semibold text-rose-600 opacity-100 transition-all duration-200 hover:scale-[1.02] hover:bg-rose-500/20 hover:opacity-100 focus-visible:outline-none active:scale-95"
          >
            <FilterX aria-hidden="true" className="size-4" />
            {t("filters.clearActive")}
          </Button>
        )}
      </div>

      <fieldset className="min-w-0">
        <legend className="text-content/45 mb-2.5 text-xs font-bold tracking-wider uppercase">
          {t("filters.statusLabel")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => {
            const isSelected = selectedStatuses.includes(status.value);
            return (
              <Button
                key={status.value}
                type="button"
                variant="ghost"
                aria-pressed={isSelected}
                onClick={() => onStatusFilterToggle(status.value)}
                className={cn(
                  "focus-visible:ring-primary/40 inline-flex h-auto items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold opacity-100 transition-all duration-200 hover:scale-[1.03] hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none active:scale-95",
                  isSelected
                    ? "bg-primary ring-primary/20 hover:bg-primary border-transparent text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] ring-2"
                    : "border-content/10 bg-surface/40 text-content/65 hover:bg-content/5 hover:border-content/20 backdrop-blur-md",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full bg-current",
                    isSelected ? "bg-white" : "opacity-60",
                  )}
                />
                {status.label}
              </Button>
            );
          })}
        </div>
      </fieldset>
    </section>
  );
}
