"use client";

import { Pagination } from "@/components/molecules/pagination";
import {
  TGetProductReviewsRequest,
  TReview,
} from "@/domain/products/types/products.model";
import type { useSubmitProductReview } from "@/hooks/products/use-submit-product-review";
import { ReviewApiError } from "./review-api-error";
import { ReviewFilterTabs } from "./review-filter-tabs";
import { ReviewList } from "./review-list";
import { ReviewRatingSummary } from "./review-rating-summary";
import { ReviewSubmitForm } from "./review-submit-form";

interface ReviewsRatingsProps {
  reviews: TReview[];
  loadingReviews: boolean;
  reviewError: string | null;
  averageRating?: number;
  totalReviews?: number;
  reviewForm: ReturnType<typeof useSubmitProductReview>;
  activeFilter: TGetProductReviewsRequest;
  onFilterChange: (filter: TGetProductReviewsRequest) => void;
  onRetryReviews: () => void;
}

export const ReviewsRatings = ({
  reviews,
  loadingReviews,
  reviewError,
  averageRating = 0,
  totalReviews = 0,
  reviewForm,
  activeFilter,
  onFilterChange,
  onRetryReviews,
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
    <div className="bg-surface border-content/[0.05] space-y-6 rounded-2xl border p-6 shadow-sm">
      <div className="flex flex-col items-baseline justify-between gap-4 md:flex-row">
        <ReviewRatingSummary
          averageRating={averageRating}
          totalReviews={totalReviews}
        />
        <ReviewFilterTabs
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </div>

      <ReviewSubmitForm
        methods={reviewForm.methods}
        isAuthenticated={reviewForm.isAuthenticated}
        isSubmitting={reviewForm.isSubmittingReview}
        error={reviewForm.submitReviewError}
        onSubmit={reviewForm.submitReview}
      />

      {reviewError ? (
        <ReviewApiError message={reviewError} onRetry={onRetryReviews} />
      ) : (
        <ReviewList reviews={reviews} loadingReviews={loadingReviews} />
      )}

      {totalPages > 1 && !loadingReviews && !reviewError && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
