"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import Button from "@/components/atoms/button";
import { TGetProductReviewsRequest } from "@/domain/products/types/products.model";
import { cn } from "@/utils/cn";

const reviewFilters: Array<{
  key: "filterAll" | "filterStars";
  rating?: number;
  value: TGetProductReviewsRequest;
}> = [
  { key: "filterAll", value: { page: 1, limit: 10, sort: "newest" } },
  {
    key: "filterStars",
    rating: 5,
    value: { page: 1, limit: 10, rating: 5, sort: "newest" },
  },
  {
    key: "filterStars",
    rating: 4,
    value: { page: 1, limit: 10, rating: 4, sort: "newest" },
  },
];

const isSameReviewFilter = (
  left: TGetProductReviewsRequest,
  right: TGetProductReviewsRequest,
) =>
  (left.rating ?? undefined) === (right.rating ?? undefined) &&
  (left.has_images ?? undefined) === (right.has_images ?? undefined) &&
  (left.sort ?? "newest") === (right.sort ?? "newest");

export interface IReviewFilterTabsProps {
  activeFilter: TGetProductReviewsRequest;
  onFilterChange: (filter: TGetProductReviewsRequest) => void;
}

export const ReviewFilterTabs = ({
  activeFilter,
  onFilterChange,
}: IReviewFilterTabsProps) => {
  const t = useTranslations("ProductDetailPage");

  const translatedLabels = useMemo(() => {
    return {
      filterAll: t("filterAll"),
      filterStars: (rating: number) =>
        t("filterStars", { rating: String(rating) }),
    };
  }, [t]);

  return (
    <div className="flex flex-wrap gap-2">
      {reviewFilters.map((filter) => {
        const isActive = isSameReviewFilter(activeFilter, filter.value);
        const displayLabel =
          filter.rating !== undefined
            ? translatedLabels.filterStars(filter.rating)
            : translatedLabels.filterAll;

        return (
          <Button
            key={`${filter.key}-${filter.rating ?? "all"}`}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all shadow-none active:scale-100",
              isActive
                ? "border-primary bg-primary/5 text-primary"
                : "border-content/[0.05] text-content/60 hover:border-content/[0.1] bg-transparent",
            )}
          >
            {displayLabel}
          </Button>
        );
      })}
    </div>
  );
};
