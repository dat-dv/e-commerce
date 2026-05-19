"use client";

import {
  FilterSection,
  FilterSidebar,
} from "@/components/molecules/filter-sidebar";
import { TCategory } from "@/domain/categories/types/categories.model";
import { CategoryFilterSection } from "./category-filter";
import { ProductSearchFilter } from "./search-filter";
import { ProductPriceFilter } from "./price-filter";
import { ProductRatingFilter } from "./rating-filter";
import { IProductFilterSidebarProps } from "./product-filter-sidebar.types";

export function ProductFilterSidebar<T extends string = string>({
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
}: IProductFilterSidebarProps<T>) {
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

      <FilterSection title="Filters">
        <ProductSearchFilter
          show={Boolean(onSearchSubmit)}
          onSearchSubmit={onSearchSubmit}
          searchPlaceholder={searchPlaceholder}
          initialSearchValue={initialSearchValue}
        />

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
