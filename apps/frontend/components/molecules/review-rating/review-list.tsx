"use client";

import { useTranslations } from "next-intl";
import EmptyState from "@/components/molecules/empty-space";
import { TReview } from "@/domain/products/types/products.model";
import { MessageCircle } from "lucide-react";
import { ReviewItem } from "./review-item";
import { ReviewListSkeleton } from "./review-list-skeleton";

interface ReviewListProps {
  reviews: TReview[];
  loadingReviews: boolean;
}

export const ReviewList = ({ reviews, loadingReviews }: ReviewListProps) => {
  const t = useTranslations("ProductDetailPage");

  if (loadingReviews) {
    return (
      <div className="divide-y divide-content/[0.05]">
        <ReviewListSkeleton />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <EmptyState
        title={t("noReviews")}
        description={t("noReviewsDesc")}
        icon={MessageCircle}
        className="rounded-2xl px-6 py-14"
        delay={0}
      />
    );
  }

  return (
    <div className="divide-y divide-content/[0.05]">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
};
