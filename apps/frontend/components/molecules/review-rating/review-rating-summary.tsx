import { useTranslations } from "next-intl";
import { ReviewRatingStars } from "./review-rating-stars";

interface ReviewRatingSummaryProps {
  averageRating: number;
  totalReviews: number;
}

export const ReviewRatingSummary = ({
  averageRating,
  totalReviews,
}: ReviewRatingSummaryProps) => {
  const t = useTranslations("ProductDetailPage");
  return (
    <div>
      <h2 className="text-content text-lg font-bold">{t("customerReviews")}</h2>
      <div className="mt-1 flex items-center gap-2">
        <ReviewRatingStars rating={averageRating} />
        <span className="text-content text-sm font-bold">
          {averageRating.toFixed(1)} / 5
        </span>
        <span className="text-content/50 text-sm font-medium">
          {t("reviewsCount", { count: String(totalReviews) })}
        </span>
      </div>
    </div>
  );
};
