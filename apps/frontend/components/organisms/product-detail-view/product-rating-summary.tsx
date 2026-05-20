"use client";

import Button from "@/components/atoms/button";
import { TProduct } from "@/domain/products/types/products.model";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProductRatingSummaryProps {
  product: TProduct;
  rating: number;
  reviewsCount: number;
}

export function ProductRatingSummary({
  product,
  rating,
  reviewsCount,
}: ProductRatingSummaryProps) {
  const t = useTranslations("ProductDetailPage");
  const roundedRating = Math.floor(rating);

  return (
    <div className="flex items-center justify-between text-sm border-b border-content/[0.05] pb-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="font-bold text-primary text-base">
            {rating.toFixed(1)}
          </span>
          <div className="flex text-primary">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={14}
                fill={index < roundedRating ? "currentColor" : "none"}
                className={index < roundedRating ? "" : "text-primary/20"}
              />
            ))}
          </div>
        </div>

        <div className="w-[1px] h-4 bg-content/[0.1]" />

        <div className="flex items-center gap-1">
          <span className="font-bold text-content">{reviewsCount}</span>
          <span className="text-content/50 text-xs">{t("reviews")}</span>
        </div>

        <div className="w-[1px] h-4 bg-content/[0.1]" />

        <div className="flex items-center gap-1">
          <span className="font-bold text-content">
            {product.soldCount || 0}
          </span>
          <span className="text-content/50 text-xs">{t("sold")}</span>
        </div>
      </div>

      <Button
        variant="ghost"
        className="text-content/40 hover:text-content hover:bg-transparent text-xs font-medium transition-colors h-auto px-0 active:scale-100"
      >
        {t("report")}
      </Button>
    </div>
  );
}
