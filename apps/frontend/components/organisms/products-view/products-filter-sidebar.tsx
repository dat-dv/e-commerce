"use client";

import React from "react";
import { FilterSidebar } from "@/app/(main)/products/filter-sidebar";
import { TCategory } from "@/domain/categories/types/categories.model";
import { useSearchParams } from "next/navigation";
import { Star } from "lucide-react";

interface ProductsFilterSidebarProps {
  categories: TCategory[];
  onFilterChange: (key: string, value: string | null) => void;
  onCategoryChange: (slug: string) => void;
}

export function ProductsFilterSidebar({
  categories,
  onFilterChange,
  onCategoryChange,
}: ProductsFilterSidebarProps) {
  const searchParams = useSearchParams();

  const handleRatingClick = (rating: number) => {
    const currentRating = searchParams.get("rating");
    if (currentRating === String(rating)) {
      onFilterChange("rating", null); // Toggle off
    } else {
      onFilterChange("rating", String(rating));
    }
  };

  return (
    <FilterSidebar categories={categories} onCategoryChange={onCategoryChange}>
      {/* Price Range */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-content">Price Range</h3>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min"
              className="w-full px-3 py-2 rounded-xl bg-content/[0.03] border border-content/10 focus:outline-none focus:border-primary transition-all text-sm"
              onBlur={(e) => onFilterChange("min_price", e.target.value)}
              defaultValue={searchParams.get("min_price") || ""}
            />
            <span className="text-content/40">-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full px-3 py-2 rounded-xl bg-content/[0.03] border border-content/10 focus:outline-none focus:border-primary transition-all text-sm"
              onBlur={(e) => onFilterChange("max_price", e.target.value)}
              defaultValue={searchParams.get("max_price") || ""}
            />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mt-6 border-t border-content/[0.05] pt-6">
        <h3 className="font-semibold text-sm mb-3 text-content">Rating</h3>
        <div className="flex flex-col gap-1.5">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingClick(rating)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                searchParams.get("rating") === String(rating)
                  ? "bg-primary/10 text-primary font-semibold"
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
              <span className="text-xs font-medium text-content/60">& Up</span>
            </button>
          ))}
        </div>
      </div>
    </FilterSidebar>
  );
}
