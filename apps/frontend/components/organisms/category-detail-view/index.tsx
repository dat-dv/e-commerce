"use client";

import AppContainer from "@/components/atoms/app-container";
import { FilterDrawerTrigger } from "@/components/molecules/filter-drawer-trigger";
import { ProductFilterSidebar } from "@/components/molecules/product-filter-sidebar";
import { ProductsHeader } from "@/components/molecules/products-header";
import {
  RenderDesktopOnly,
  RenderTabletBelow,
} from "@/components/molecules/responsive";
import { ProductsCatalog } from "@/components/organisms/products-view/products-catalog";
import { TProduct } from "@/domain/products/types/products.model";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";
import {
  CategoryProductsFilterKey,
  useCategoryProductsFilter,
} from "@/hooks/categories/use-category-products-filter";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { CategoryFilterDrawer } from "./category-filter-drawer";

interface CategoryDetailViewProps {
  categorySlug: string;
  products: TProduct[];
  totalProducts: number;
  totalPages: number;
}

export function CategoryDetailView({
  categorySlug,
  products,
  totalProducts,
  totalPages,
}: CategoryDetailViewProps) {
  const t = useTranslations("CategoryDetailPage");
  const tProducts = useTranslations("ProductsPage");
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { categories, getCategoryNavigationContext } = useCategoriesStore(
    useShallow((state) => ({
      categories: state.categories,
      getCategoryNavigationContext: state.getCategoryNavigationContext,
    })),
  );

  const {
    filterMinPrice,
    filterMaxPrice,
    filterRating,
    filterSort,
    filterSearch,
    currentPage,
    updateFilter,
    submitSearch,
    clearFilter,
    resetFilters,
    changePage,
  } = useCategoryProductsFilter();

  const { activeCategory, topCategory } = useMemo(
    () => getCategoryNavigationContext(categorySlug),
    [categorySlug, getCategoryNavigationContext],
  );

  const displayCategories = topCategory ? [topCategory] : categories;
  const categoryTitle = activeCategory?.name || t("fallbackTitle");

  const navigateToCategory = (slug: string) => {
    const current = new URLSearchParams(window.location.search);
    current.delete("page");
    const queryString = current.toString();
    router.push(
      queryString
        ? `/categories/${slug}?${queryString}`
        : `/categories/${slug}`,
    );
  };
  const handleDrawerCategoryChange = (slug: string) => {
    setIsFilterOpen(false);
    navigateToCategory(slug);
  };

  return (
    <AppContainer size="2xl" className="py-16">
      <ProductsHeader
        title={categoryTitle}
        description={t("description", { category: categoryTitle })}
      />

      <RenderTabletBelow>
        <FilterDrawerTrigger
          eyebrow={tProducts("filters")}
          label={categoryTitle}
          buttonLabel={tProducts("filterButton")}
          onPress={() => setIsFilterOpen(true)}
        />
      </RenderTabletBelow>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <RenderDesktopOnly>
          <div className="col-span-1">
            <ProductFilterSidebar<CategoryProductsFilterKey>
              categories={displayCategories}
              onFilterChange={updateFilter}
              onCategoryChange={navigateToCategory}
              initialSearchValue={filterSearch}
              searchPlaceholder={t("searchPlaceholder", {
                category: categoryTitle,
              })}
              onSearchSubmit={submitSearch}
              minPriceValue={filterMinPrice}
              maxPriceValue={filterMaxPrice}
              ratingValue={filterRating}
              activeSlug={categorySlug}
            />
          </div>
        </RenderDesktopOnly>

        <ProductsCatalog<CategoryProductsFilterKey>
          products={products}
          total={totalProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={false}
          pageStr={String(currentPage)}
          categoryTitle={categoryTitle}
          appliedFilters={{
            search: filterSearch,
            sort: filterSort ? String(filterSort) : undefined,
            min_price: filterMinPrice ? Number(filterMinPrice) : undefined,
            max_price: filterMaxPrice ? Number(filterMaxPrice) : undefined,
            rating: filterRating ? Number(filterRating) : undefined,
          }}
          onClearFilter={clearFilter}
          onResetFilters={resetFilters}
          onPageChange={changePage}
          onSortChange={(value) => updateFilter([{ key: "sort", value }])}
        />
      </div>

      <RenderTabletBelow>
        <CategoryFilterDrawer<CategoryProductsFilterKey>
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          categories={displayCategories}
          onFilterChange={updateFilter}
          onCategoryChange={handleDrawerCategoryChange}
          initialSearchValue={filterSearch}
          searchPlaceholder={t("searchPlaceholder", {
            category: categoryTitle,
          })}
          onSearchSubmit={submitSearch}
          minPriceValue={filterMinPrice}
          maxPriceValue={filterMaxPrice}
          ratingValue={filterRating}
          activeSlug={categorySlug}
        />
      </RenderTabletBelow>
    </AppContainer>
  );
}
