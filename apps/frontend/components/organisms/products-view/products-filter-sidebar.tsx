"use client";

import React from "react";
import { FilterSidebar } from "@/app/(main)/products/filter-sidebar";
import { TCategory } from "@/domain/categories/types/categories.model";
import { Search, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductsFilterSidebarProps {
  categories: TCategory[];
  onFilterChange: (key: string, value: string | null) => void;
  onCategoryChange: (slug: string) => void;
  hideCategories?: boolean;
  searchPlaceholder?: string;
  initialSearchValue?: string;
  onSearchSubmit?: (value: string) => void;
  minPriceValue?: string;
  maxPriceValue?: string;
  ratingValue?: string;
  activeSlug?: string;
}

export function ProductsFilterSidebar({
  categories,
  onFilterChange,
  onCategoryChange,
  hideCategories = false,
  searchPlaceholder = "Search products",
  initialSearchValue = "",
  onSearchSubmit,
  minPriceValue = "",
  maxPriceValue = "",
  ratingValue = "",
  activeSlug = "",
}: ProductsFilterSidebarProps) {
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const [minPrice, setMinPrice] = useState(minPriceValue);
  const [maxPrice, setMaxPrice] = useState(maxPriceValue);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchValue(initialSearchValue);
  }, [initialSearchValue]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMinPrice(minPriceValue);
    setMaxPrice(maxPriceValue);
  }, [minPriceValue, maxPriceValue]);

  const handleRatingClick = (rating: number) => {
    if (ratingValue === String(rating)) {
      onFilterChange("rating", null); // Toggle off
    } else {
      onFilterChange("rating", String(rating));
    }
  };

  const applyPriceRange = () => {
    if (onFilterChange) {
      onFilterChange("min_price", minPrice || null);
      onFilterChange("max_price", maxPrice || null);
    }
  };

  return (
    <FilterSidebar
      categories={categories}
      onCategoryChange={onCategoryChange}
      hideCategories={hideCategories}
      activeSlug={activeSlug}
    >
      {onSearchSubmit && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSearchSubmit(searchValue);
          }}
          className="flex flex-col gap-3 border-b border-content/[0.06] pb-5"
        >
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-content/45">
            Search
          </h3>
          <div className="flex items-center gap-2 rounded-xl border border-content/10 bg-content/[0.03] px-3 py-2">
            <Search size={16} className="shrink-0 text-content/35" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder={searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-content outline-none placeholder:text-content/35"
            />
          </div>
          <button
            type="submit"
            className="h-10 rounded-xl bg-primary px-4 text-xs font-bold uppercase tracking-widest text-white transition-transform active:scale-95"
          >
            Search
          </button>
        </form>
      )}

      {/* Price Range */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          applyPriceRange();
        }}
        className="border-b border-content/[0.06] pb-5"
      >
        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-content/45">
          Price Range
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min"
              className="h-10 w-full rounded-xl border border-content/10 bg-content/[0.03] px-3 text-sm font-medium text-content outline-none transition-all placeholder:text-content/35 focus:border-primary"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
            />
            <span className="text-sm font-semibold text-content/25">-</span>
            <input
              type="number"
              placeholder="Max"
              className="h-10 w-full rounded-xl border border-content/10 bg-content/[0.03] px-3 text-sm font-medium text-content outline-none transition-all placeholder:text-content/35 focus:border-primary"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
            />
          </div>
          <button
            type="submit"
            className="h-10 rounded-xl border border-content/10 px-4 text-xs font-bold uppercase tracking-widest text-content/60 transition-all hover:border-primary/30 hover:text-primary active:scale-95"
          >
            Apply Price
          </button>
        </div>
      </form>

      {/* Rating Filter */}
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
    </FilterSidebar>
  );
}
