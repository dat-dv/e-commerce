"use client";

import { ReviewRatingStars } from "./review-rating-stars";

interface ReviewRatingSummaryProps {
  averageRating: number;
  totalReviews: number;
}

export const ReviewRatingSummary = ({
  averageRating,
  totalReviews,
}: ReviewRatingSummaryProps) => {
  return (
    <div>
      <h2 className="text-lg font-bold text-content">Customer Reviews</h2>
      <div className="mt-1 flex items-center gap-2">
        <ReviewRatingStars rating={averageRating} />
        <span className="text-sm font-bold text-content">
          {averageRating.toFixed(1)} / 5
        </span>
        <span className="text-sm text-content/50">
          ({totalReviews} reviews)
        </span>
      </div>
    </div>
  );
};
