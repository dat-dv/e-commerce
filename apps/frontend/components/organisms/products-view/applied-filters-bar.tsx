"use client";

import { X } from "lucide-react";
import { EProductSort } from "@ecommerce/shared";

export interface AppliedFilters {
  search?: string;
  sort?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
}

interface AppliedFiltersBarProps<T extends string = string> {
  filters: AppliedFilters;
  onClearFilter: (key: T) => void;
  onResetFilters: () => void;
}

const sortLabels: Record<string, string> = {
  [EProductSort.DEFAULT]: "Newest",
  [EProductSort.BUY_MOST]: "Best Selling",
  [EProductSort.PRICE_ASC]: "Price Low to High",
  [EProductSort.PRICE_DESC]: "Price High to Low",
};

export function AppliedFiltersBar<T extends string = string>({
  filters,
  onClearFilter,
  onResetFilters,
}: AppliedFiltersBarProps<T>) {
  const chips: { key: T; label: string }[] = [];

  if (filters.search) {
    chips.push({ key: "search" as T, label: `Search: ${filters.search}` });
  }
  if (filters.sort && filters.sort !== EProductSort.DEFAULT.toString()) {
    chips.push({
      key: "sort" as T,
      label: `Sort: ${sortLabels[filters.sort] || filters.sort}`,
    });
  }
  if (filters.min_price !== undefined) {
    chips.push({ key: "min_price" as T, label: `Min: ${filters.min_price}` });
  }
  if (filters.max_price !== undefined) {
    chips.push({ key: "max_price" as T, label: `Max: ${filters.max_price}` });
  }
  if (filters.rating !== undefined) {
    chips.push({ key: "rating" as T, label: `${filters.rating}+ Stars` });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-content/[0.06] bg-content/[0.02] p-3">
      <span className="mr-1 text-[11px] font-bold uppercase tracking-widest text-content/35">
        Applied
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={() => onClearFilter(chip.key)}
          className="inline-flex h-8 items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 text-xs font-bold text-primary transition-colors hover:bg-primary/15"
        >
          {chip.label}
          <X size={13} />
        </button>
      ))}
      <button
        onClick={onResetFilters}
        className="ml-auto h-8 rounded-full border border-content/10 px-3 text-xs font-bold text-content/45 transition-colors hover:border-primary/30 hover:text-primary"
      >
        Reset all
      </button>
    </div>
  );
}
