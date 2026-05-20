"use client";

import Button from "@/components/atoms/button";
import SearchInput from "@/components/molecules/search-input";
import { cn } from "@/utils/cn";
import { EOrderStatus } from "@ecommerce/shared";
import { FilterX } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";

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
      switch (status) {
        case EOrderStatus.PENDING:
          return tStatus("pending");
        case EOrderStatus.PAID:
          return tStatus("paid");
        case EOrderStatus.SHIPPING:
          return tStatus("shipping");
        case EOrderStatus.DELIVERED:
          return tStatus("delivered");
        case EOrderStatus.CANCEL_REQUESTED:
          return tStatus("cancelRequested");
        case EOrderStatus.CANCEL_PROCESSING:
          return tStatus("cancelProcessing");
        case EOrderStatus.CANCELLED:
          return tStatus("cancelled");
        case EOrderStatus.RETURN_REQUESTED:
          return tStatus("returnRequested");
        case EOrderStatus.RETURN_PROCESSING:
          return tStatus("returnProcessing");
        case EOrderStatus.RETURNED:
          return tStatus("returned");
        case EOrderStatus.RETURN_REJECTED:
          return tStatus("returnRejected");
        default:
          return t("results.unknown");
      }
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
      className="flex flex-col gap-6 border-b border-content/[0.08] pb-6"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <label
            htmlFor="admin-order-search"
            className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-content/45"
          >
            {t("filters.searchLabel")}
          </label>
          <SearchInput
            id="admin-order-search"
            value={search}
            onSearch={onSearch}
            placeholder={t("filters.searchPlaceholder")}
            loading={loading}
            className="w-full bg-surface/40 border border-content/10 backdrop-blur-md focus-within:border-primary/30"
          />
        </div>

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={onClearFilters}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-transparent bg-rose-500/10 px-4 text-sm font-semibold text-rose-600 transition-all duration-200 hover:bg-rose-500/20 hover:scale-[1.02] focus-visible:outline-none active:scale-95 opacity-100 hover:opacity-100"
          >
            <FilterX aria-hidden="true" className="size-4" />
            {t("filters.clearActive")}
          </Button>
        )}
      </div>

      <fieldset className="min-w-0">
        <legend className="mb-2.5 text-xs font-bold uppercase tracking-wider text-content/45">
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
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold border transition-all duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 h-auto active:scale-95 opacity-100 hover:opacity-100",
                  isSelected
                    ? "border-transparent bg-primary text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] ring-2 ring-primary/20 hover:bg-primary"
                    : "border-content/10 bg-surface/40 backdrop-blur-md text-content/65 hover:bg-content/5 hover:border-content/20",
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
