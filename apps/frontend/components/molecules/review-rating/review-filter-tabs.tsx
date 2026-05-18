"use client";

import { TGetProductReviewsRequest } from "@/domain/products/types/products.model";

const reviewFilters: Array<{
  label: string;
  value: TGetProductReviewsRequest;
}> = [
  { label: "All", value: { page: 1, limit: 10, sort: "newest" } },
  {
    label: "5 Stars",
    value: { page: 1, limit: 10, rating: 5, sort: "newest" },
  },
  {
    label: "4 Stars",
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
  return (
    <div className="flex flex-wrap gap-2">
      {reviewFilters.map((filter) => {
        const isActive = isSameReviewFilter(activeFilter, filter.value);

        return (
          <button
            key={filter.label}
            onClick={() => onFilterChange(filter.value)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
              isActive
                ? "border-primary bg-primary/5 text-primary"
                : "border-content/[0.05] text-content/60 hover:border-content/[0.1]"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};
