"use client";

import React from "react";
import { Star, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react";
import { TReview } from "@/domain/products/types/products.model";

interface ReviewsRatingsProps {
  reviews: TReview[];
  loadingReviews: boolean;
}

export const ReviewsRatings = ({
  reviews,
  loadingReviews,
}: ReviewsRatingsProps) => {
  return (
    <div className="bg-surface border border-content/[0.05] rounded-2xl p-6 space-y-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-baseline">
        <div>
          <h2 className="text-lg font-bold text-content">
            Đánh giá từ khách hàng
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <span className="text-sm font-bold text-content">4.8 / 5</span>
            <span className="text-sm text-content/50">(256 đánh giá)</span>
          </div>
        </div>

        {/* Review Filters */}
        <div className="flex flex-wrap gap-2">
          {["Tất cả", "5 Sao", "4 Sao", "Có hình ảnh"].map((filter, index) => (
            <button
              key={index}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                index === 0
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-content/[0.05] hover:border-content/[0.1] text-content/60"
              }`}
            >
              {filter}
            </button>
          ))}
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
        ) : reviews.length === 0 ? (
          <div className="col-span-full text-center text-content/50 py-8">
            Chưa có đánh giá nào
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="py-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-content text-sm">
                    {review.user?.name || "Người dùng ẩn danh"}
                  </span>
                  <div className="flex text-amber-400 mt-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-content/30">
                  {new Date(review.created_at).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <p className="text-sm text-content/70">{review.comment}</p>
              <button className="flex items-center gap-1.5 text-xs text-content/40 hover:text-content transition-colors w-fit">
                <ThumbsUp size={12} />
                <span>Hữu ích</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 pt-2">
        <button className="p-1.5 rounded-lg border border-content/[0.05] opacity-50 cursor-not-allowed">
          <ChevronLeft size={14} />
        </button>
        <button className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs">
          1
        </button>
        <button className="w-7 h-7 rounded-lg border border-content/[0.05] text-xs hover:bg-content/[0.03]">
          2
        </button>
        <button className="p-1.5 rounded-lg border border-content/[0.05] hover:bg-content/[0.03]">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
