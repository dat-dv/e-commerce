"use client";

import { EProductSort } from "@ecommerce/shared";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import Button from "@/components/atoms/button";

export interface AppliedFilters {
  search?: string;
  sort?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
  category?: string;
}

interface AppliedFiltersBarProps<T extends string = string> {
  filters: AppliedFilters;
  onClearFilter: (key: T) => void;
  onResetFilters: () => void;
}

const sortLabelKeys: Record<
  string,
  "newest" | "bestSelling" | "priceLowToHigh" | "priceHighToLow"
> = {
  [EProductSort.DEFAULT]: "newest",
  [EProductSort.BUY_MOST]: "bestSelling",
  [EProductSort.PRICE_ASC]: "priceLowToHigh",
  [EProductSort.PRICE_DESC]: "priceHighToLow",
};

export function AppliedFiltersBar<T extends string = string>({
  filters,
  onClearFilter,
  onResetFilters,
}: AppliedFiltersBarProps<T>) {
  const t = useTranslations("ProductsPage.appliedFilters");
  const chips: { key: T; label: string }[] = [];

  if (filters.search) {
    chips.push({
      key: "search" as T,
      label: t("search", { value: filters.search }),
    });
  }
  if (filters.sort && filters.sort !== EProductSort.DEFAULT.toString()) {
    const sortKey = sortLabelKeys[filters.sort];
    chips.push({
      key: "sort" as T,
      label: t("sort", {
        value: sortKey ? t(`sortOptions.${sortKey}`) : filters.sort,
      }),
    });
  }
  if (filters.min_price !== undefined) {
    chips.push({
      key: "min_price" as T,
      label: t("min", { value: String(filters.min_price) }),
    });
  }
  if (filters.max_price !== undefined) {
    chips.push({
      key: "max_price" as T,
      label: t("max", { value: String(filters.max_price) }),
    });
  }
  if (filters.rating !== undefined) {
    chips.push({
      key: "rating" as T,
      label: t("rating", { value: String(filters.rating) }),
    });
  }
  if (filters.category) {
    chips.push({
      key: "category" as T,
      label: t("category", { value: filters.category }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-content/[0.06] bg-content/[0.02] p-3">
      <span className="mr-1 text-[11px] font-bold uppercase tracking-widest text-content/35">
        {t("applied")}
      </span>
      {chips.map((chip) => (
        <Button
          key={chip.key}
          variant="ghost"
          onClick={() => onClearFilter(chip.key)}
          className="inline-flex h-8 items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 text-xs font-bold text-primary transition-colors hover:bg-primary/15 active:scale-95 opacity-100 hover:opacity-100"
        >
          {chip.label}
          <X size={13} />
        </Button>
      ))}
      <Button
        variant="ghost"
        onClick={onResetFilters}
        className="ml-auto h-8 rounded-full border border-content/10 px-3 text-xs font-bold text-content/45 transition-colors hover:border-primary/30 hover:text-primary active:scale-95 opacity-100 hover:opacity-100 hover:bg-transparent"
      >
        {t("resetAll")}
      </Button>
    </div>
  );
}

export default AppliedFiltersBar;
