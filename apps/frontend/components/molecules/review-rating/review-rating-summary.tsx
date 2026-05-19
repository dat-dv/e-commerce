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
      <h2 className="text-lg font-bold text-content">{t("customerReviews")}</h2>
      <div className="mt-1 flex items-center gap-2">
        <ReviewRatingStars rating={averageRating} />
        <span className="text-sm font-bold text-content">
          {averageRating.toFixed(1)} / 5
        </span>
        <span className="text-sm text-content/50 font-medium">
          {t("reviewsCount", { count: totalReviews })}
        </span>
      </div>
    </div>
  );
};
