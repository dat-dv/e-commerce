"use client";

import { useLocale, useTranslations } from "next-intl";
import { TReview } from "@/domain/products/types/products.model";
import { ReviewRatingStars } from "./review-rating-stars";

interface ReviewItemProps {
  review: TReview;
}

export const ReviewItem = ({ review }: ReviewItemProps) => {
  const t = useTranslations("ProductDetailPage");
  const locale = useLocale();

  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-bold text-content">
            {review.user?.name || t("anonymousUser")}
          </span>
          <div className="mt-0.5">
            <ReviewRatingStars
              rating={review.rating}
              size={12}
              inactiveClassName="text-content/10"
            />
          </div>
        </div>
        <span className="text-xs text-content/30">
          {new Date(review.createdAt).toLocaleDateString(
            locale === "vi" ? "vi-VN" : "en-US",
          )}
        </span>
      </div>
      <p className="text-sm text-content/70">{review.comment}</p>
    </div>
  );
};
