"use client";

import { Star } from "lucide-react";

interface ReviewRatingStarsProps {
  rating: number;
  size?: number;
  inactiveClassName?: string;
}

export const ReviewRatingStars = ({
  rating,
  size = 14,
  inactiveClassName = "text-content/20",
}: ReviewRatingStarsProps) => {
  const ratingFloor = Math.floor(rating);

  return (
    <div className="flex text-amber-400">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={size}
          fill={index < ratingFloor ? "currentColor" : "none"}
          className={index < ratingFloor ? "" : inactiveClassName}
        />
      ))}
    </div>
  );
};
