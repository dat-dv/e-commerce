"use client";

import { EProductSort } from "@ecommerce/shared";
import { useTranslations } from "next-intl";
import { AppliedFiltersBar as SharedAppliedFiltersBar } from "@ecommerce/ui";
import { Fragment } from "react";

export interface AppliedFilters {
  search?: string;
  sort?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
  category_slug?: string;
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
  if (filters.category_slug) {
    chips.push({
      key: "category_slug" as T,
      label: t("category", { value: filters.category_slug }),
    });
  }

  return (
    <SharedAppliedFiltersBar
      chips={chips}
      onClearFilter={onClearFilter}
      onResetFilters={onResetFilters}
      appliedLabel={t("applied")}
      resetAllLabel={t("resetAll")}
    />
  );
}

export default AppliedFiltersBar;
