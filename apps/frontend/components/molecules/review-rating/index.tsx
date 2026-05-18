"use client";

import { Pagination } from "@/components/molecules/pagination";
import {
  TGetProductReviewsRequest,
  TReview,
} from "@/domain/products/types/products.model";
import { ReviewFilterTabs } from "./review-filter-tabs";
import { ReviewList } from "./review-list";
import { ReviewRatingSummary } from "./review-rating-summary";

interface ReviewsRatingsProps {
  reviews: TReview[];
  loadingReviews: boolean;
  averageRating?: number;
  totalReviews?: number;
  activeFilter: TGetProductReviewsRequest;
  onFilterChange: (filter: TGetProductReviewsRequest) => void;
}

export const ReviewsRatings = ({
  reviews,
  loadingReviews,
  averageRating = 0,
  totalReviews = 0,
  activeFilter,
  onFilterChange,
}: ReviewsRatingsProps) => {
  const currentPage = activeFilter.page ?? 1;
  const limit = activeFilter.limit ?? 10;
  const totalPages = Math.max(Math.ceil(totalReviews / limit), 1);

  const handlePageChange = (page: number) => {
    onFilterChange({
      ...activeFilter,
      page,
      limit,
    });
  };

  return (
    <div className="bg-surface border border-content/[0.05] rounded-2xl p-6 space-y-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-baseline">
        <ReviewRatingSummary
          averageRating={averageRating}
          totalReviews={totalReviews}
        />
        <ReviewFilterTabs
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </div>

      <ReviewList reviews={reviews} loadingReviews={loadingReviews} />

      {totalPages > 1 && !loadingReviews && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
