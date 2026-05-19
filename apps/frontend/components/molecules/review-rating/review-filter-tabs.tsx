"use client";

import { TGetProductReviewsRequest } from "@/domain/products/types/products.model";

import { useTranslations } from "next-intl";

const reviewFilters: Array<{
  key: string;
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

interface ReviewFilterTabsProps {
  activeFilter: TGetProductReviewsRequest;
  onFilterChange: (filter: TGetProductReviewsRequest) => void;
}

export const ReviewFilterTabs = ({
  activeFilter,
  onFilterChange,
}: ReviewFilterTabsProps) => {
  const t = useTranslations("ProductDetailPage");
  return (
    <div className="flex flex-wrap gap-2">
      {reviewFilters.map((filter) => {
        const isActive = isSameReviewFilter(activeFilter, filter.value);
        const displayLabel =
          filter.rating !== undefined
            ? t(filter.key as never, { rating: String(filter.rating) } as never)
            : t(filter.key as never);

        return (
          <button
            key={`${filter.key}-${filter.rating ?? "all"}`}
            onClick={() => onFilterChange(filter.value)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
              isActive
                ? "border-primary bg-primary/5 text-primary"
                : "border-content/[0.05] text-content/60 hover:border-content/[0.1]"
            }`}
          >
            {displayLabel}
          </button>
        );
      })}
    </div>
  );
};
