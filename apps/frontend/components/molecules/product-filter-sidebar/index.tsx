"use client";

import {
  FilterSection,
  FilterSidebar,
  PriceRangeFilter,
  RatingFilter,
} from "@ecommerce/ui";
import { useTranslations } from "next-intl";
import { CategoryFilterSection } from "./category-filter";
import { IProductFilterSidebarProps } from "./product-filter-sidebar.types";

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
        <PriceRangeFilter<T>
          minPriceValue={minPriceValue}
          maxPriceValue={maxPriceValue}
          onFilterChange={onFilterChange}
          labels={{
            title: t("priceRange"),
            min: t("min"),
            max: t("max"),
            apply: t("applyPrice"),
          }}
        />

        <RatingFilter
          onRatingClick={handleRatingClick}
          ratingValue={ratingValue}
          labels={{
            title: t("rating"),
            suffix: t("up"),
          }}
        />
      </FilterSection>
    </FilterSidebar>
  );
}

export default ProductFilterSidebar;
