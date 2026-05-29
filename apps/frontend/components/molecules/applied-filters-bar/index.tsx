"use client";

import { EProductSort } from "@ecommerce/shared";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@ecommerce/ui";
import { TYPOGRAPHY } from "@/constants/typography";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
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

  if (chips.length === 0) return null;

  return (
    <div
      className={cn(
        UI_RADIUS.panel,
        "border-content/[0.06] bg-content/[0.02] mb-6 flex flex-wrap items-center gap-2 border p-3",
      )}
    >
      <span
        className={`mr-1 ${TYPOGRAPHY.badge} text-content/35 tracking-widest uppercase`}
      >
        {t("applied")}
      </span>
      {chips?.map((chip, idx) => {
        if (chip.label.trim() === "") return <Fragment key={idx} />;
        return (
          <Button
            key={chip.key}
            variant="ghost"
            onClick={() => onClearFilter(chip.key)}
            className={`border-primary/15 bg-primary/10 inline-flex h-8 items-center gap-2 rounded-full border px-3 ${TYPOGRAPHY.caption} text-primary hover:bg-primary/15 font-bold opacity-100 transition-colors hover:opacity-100 active:scale-95`}
          >
            {chip.label}
            <X size={13} />
          </Button>
        );
      })}
      <Button
        variant="ghost"
        onClick={onResetFilters}
        className={`border-content/10 ml-auto h-8 rounded-full border px-3 ${TYPOGRAPHY.caption} text-content/45 hover:border-primary/30 hover:text-primary font-bold opacity-100 transition-colors hover:bg-transparent hover:opacity-100 active:scale-95`}
      >
        {t("resetAll")}
      </Button>
    </div>
  );
}

export default AppliedFiltersBar;
