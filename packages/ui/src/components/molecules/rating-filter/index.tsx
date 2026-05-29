"use client";

import { Star } from "lucide-react";

import { TYPOGRAPHY } from "../../../tokens";
import Button from "../../atoms/button";

export type {
  IRatingFilterLabels,
  IRatingFilterProps,
} from "./rating-filter.types";

export interface RatingFilterLabels {
  title?: string;
  suffix?: string;
}

export interface RatingFilterProps {
  ratingValue?: string;
  onRatingClick: (rating: number) => void;
  labels?: RatingFilterLabels;
  ratings?: number[];
}

export function RatingFilter({
  ratingValue = "",
  onRatingClick,
  labels,
  ratings = [5, 4, 3, 2, 1],
}: RatingFilterProps) {
  const title = labels?.title ?? "Rating";
  const suffix = labels?.suffix ?? "up";

  return (
    <div>
      <h3
        className={`text-content/45 mb-3 ${TYPOGRAPHY.badge} tracking-widest uppercase`}
      >
        {title}
      </h3>
      <div className="flex flex-col gap-1.5">
        {ratings.map((rating) => (
          <Button
            key={rating}
            variant="ghost"
            onClick={() => onRatingClick(rating)}
            className={`flex h-auto min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm ${
              ratingValue === String(rating)
                ? "bg-primary/10 text-primary font-bold"
                : "text-content/70 hover:bg-content/5 hover:text-content"
            }`}
          >
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  size={14}
                  fill={index < rating ? "currentColor" : "none"}
                  className={index < rating ? "" : "opacity-30"}
                />
              ))}
            </div>
            <span className="text-content/60 text-sm font-medium">
              {suffix}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}

RatingFilter.displayName = "RatingFilter";

export default RatingFilter;
