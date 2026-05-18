"use client";

import React from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import {
  TGetProductReviewsRequest,
  TReview,
} from "@/domain/products/types/products.model";

interface ReviewsRatingsProps {
  reviews: TReview[];
  loadingReviews: boolean;
  averageRating?: number;
  totalReviews?: number;
  activeFilter: TGetProductReviewsRequest;
  onFilterChange: (filter: TGetProductReviewsRequest) => void;
}

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
  {
    label: "With Images",
    value: { page: 1, limit: 10, has_images: true, sort: "newest" },
  },
];

const isSameReviewFilter = (
  left: TGetProductReviewsRequest,
  right: TGetProductReviewsRequest,
) =>
  (left.rating ?? undefined) === (right.rating ?? undefined) &&
  (left.has_images ?? undefined) === (right.has_images ?? undefined) &&
  (left.sort ?? "newest") === (right.sort ?? "newest");

export const ReviewsRatings = ({
  reviews,
  loadingReviews,
  averageRating = 0,
  totalReviews = 0,
  activeFilter,
  onFilterChange,
}: ReviewsRatingsProps) => {
  const isEmpty = !loadingReviews && reviews.length === 0;
  const formattedAverageRating = averageRating.toFixed(1);
  const ratingFloor = Math.floor(averageRating);

  const shouldShowPagination = totalReviews > reviews.length;

  return (
    <div className="bg-surface border border-content/[0.05] rounded-2xl p-6 space-y-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-baseline">
        <div>
          <h2 className="text-lg font-bold text-content">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < ratingFloor ? "currentColor" : "none"}
                  className={i < ratingFloor ? "" : "text-content/20"}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-content">
              {formattedAverageRating} / 5
            </span>
            <span className="text-sm text-content/50">
              ({totalReviews} reviews)
            </span>
          </div>
        </div>

        {/* Review Filters */}
        <div className="flex flex-wrap gap-2">
          {reviewFilters.map((filter) => {
            const isActive = isSameReviewFilter(activeFilter, filter.value);
            return (
              <button
                key={filter.label}
                onClick={() => onFilterChange(filter.value)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  isActive
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-content/[0.05] hover:border-content/[0.1] text-content/60"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Review List */}
      <div className="divide-y divide-content/[0.05]">
        {loadingReviews ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="py-4 animate-pulse">
              <div className="h-4 bg-content/[0.05] rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-content/[0.05] rounded w-full mb-1"></div>
              <div className="h-3 bg-content/[0.05] rounded w-2/3"></div>
            </div>
          ))
        ) : isEmpty ? (
          <div className="col-span-full text-center text-content/50 py-8">
            No reviews yet
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="py-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-content text-sm">
                    {review.user?.name || "Anonymous User"}
                  </span>
                  <div className="flex text-amber-400 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < review.rating ? "currentColor" : "none"}
                        className={i < review.rating ? "" : "text-content/10"}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-content/30">
                  {new Date(review.createdAt).toLocaleDateString("en-US")}
                </span>
              </div>
              <p className="text-sm text-content/70">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {shouldShowPagination && (
        <div className="flex justify-center gap-2 pt-2">
          <button className="p-1.5 rounded-lg border border-content/[0.05] opacity-50 cursor-not-allowed">
            <ChevronLeft size={14} />
          </button>
          <button className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs">
            1
          </button>
          <button className="p-1.5 rounded-lg border border-content/[0.05] hover:bg-content/[0.03]">
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
