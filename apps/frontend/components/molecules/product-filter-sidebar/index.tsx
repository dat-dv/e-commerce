"use client";

import {
  FilterSection,
  FilterSidebar,
} from "@/components/molecules/filter-sidebar";
import { useTranslations } from "next-intl";
import { CategoryFilterSection } from "./category-filter";
import { ProductPriceFilter } from "./price-filter";
import { IProductFilterSidebarProps } from "./product-filter-sidebar.types";
import { ProductRatingFilter } from "./rating-filter";

export function ProductFilterSidebar<T extends string = string>({
  categories,
  onFilterChange,
  onCategoryChange,
  hideCategories = false,
  minPriceValue = "",
  maxPriceValue = "",
  ratingValue = "",
  activeSlug = "",
}: IProductFilterSidebarProps<T>) {
  const t = useTranslations("ProductsPage");
  const handleRatingClick = (rating: number) => {
    if (ratingValue === String(rating)) {
      onFilterChange([{ key: "rating" as T, value: null }]); // Toggle off
    } else {
      onFilterChange([{ key: "rating" as T, value: String(rating) }]);
    }
  };

  return (
    <FilterSidebar>
      {!hideCategories && (
        <CategoryFilterSection
          categories={categories}
          activeSlug={activeSlug}
          onCategoryChange={onCategoryChange}
        />
      )}

      <FilterSection title={t("filters")}>
        {/* Price Range */}
        <ProductPriceFilter<T>
          minPriceValue={minPriceValue}
          maxPriceValue={maxPriceValue}
          onFilterChange={onFilterChange}
        />

        {/* Rating Filter */}
        <ProductRatingFilter
          handleRatingClick={handleRatingClick}
          ratingValue={ratingValue}
        />
      </FilterSection>
    </FilterSidebar>
  );
}

export default ProductFilterSidebar;
