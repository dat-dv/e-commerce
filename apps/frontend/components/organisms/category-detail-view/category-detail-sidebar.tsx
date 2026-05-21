"use client";

import { ProductFilterSidebar } from "@/components/molecules/product-filter-sidebar";
import { TCategory } from "@/domain/categories/types/categories.model";

type CategoryProductsFilterKey =
  | "search"
  | "sort"
  | "min_price"
  | "max_price"
  | "rating";

interface CategoryDetailSidebarProps {
  categorySlug: string;
  categories: TCategory[];
  onFilterChange: (
    filters: { key: CategoryProductsFilterKey; value: string | null }[],
  ) => void;
  onCategoryChange: (slug: string) => void;
  minPriceValue: string;
  maxPriceValue: string;
  ratingValue: string;
}

export function CategoryDetailSidebar({
  categorySlug,
  categories,
  onFilterChange,
  onCategoryChange,
  minPriceValue,
  maxPriceValue,
  ratingValue,
}: CategoryDetailSidebarProps) {
  return (
    <ProductFilterSidebar<CategoryProductsFilterKey>
      categories={categories}
      onFilterChange={onFilterChange}
      onCategoryChange={onCategoryChange}
      minPriceValue={minPriceValue}
      maxPriceValue={maxPriceValue}
      ratingValue={ratingValue}
      activeSlug={categorySlug}
    />
  );
}
