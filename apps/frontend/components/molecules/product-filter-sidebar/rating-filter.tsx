import { Star } from "lucide-react";
import React from "react";

import { IProductRatingFilterProps } from "./product-filter-sidebar.types";

export function ProductRatingFilter({
  handleRatingClick,
  ratingValue,
}: IProductRatingFilterProps) {
  return (
    <div>
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-content/45">
        Rating
      </h3>
      <div className="flex flex-col gap-1.5">
        {[5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => handleRatingClick(rating)}
            className={`flex min-h-10 items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
              ratingValue === String(rating)
                ? "bg-primary/10 text-primary font-bold"
                : "text-content/70 hover:bg-content/5 hover:text-content"
            }`}
          >
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < rating ? "currentColor" : "none"}
                  className={i < rating ? "" : "opacity-30"}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-content/60">& Up</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductRatingFilter;
