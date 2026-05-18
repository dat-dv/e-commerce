"use client";

import AppContainer from "@/components/atoms/app-container";
import { ProductsHeader } from "@/app/(main)/products/products-header";
import { ProductsFilterSidebar } from "@/components/organisms/products-view/products-filter-sidebar";
import { ProductsCatalog } from "@/components/organisms/products-view/products-catalog";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import {
  useCategoryProductsFilter,
  CategoryProductsFilterKey,
} from "@/hooks/categories/use-category-products-filter";
import { TProduct } from "@/domain/products/types/products.model";

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
  const router = useRouter();

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
  const categoryTitle = activeCategory?.name || "Products";

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

  return (
    <AppContainer size="2xl" className="py-16">
      <ProductsHeader
        title={categoryTitle}
        description={`Explore our finest selection of ${categoryTitle}. Handpicked for quality, price, and availability.`}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ProductsFilterSidebar<CategoryProductsFilterKey>
            categories={displayCategories}
            onFilterChange={updateFilter}
            onCategoryChange={navigateToCategory}
            initialSearchValue={filterSearch}
            searchPlaceholder={`Search ${categoryTitle}`}
            onSearchSubmit={submitSearch}
            minPriceValue={filterMinPrice}
            maxPriceValue={filterMaxPrice}
            ratingValue={filterRating}
            activeSlug={categorySlug}
          />
        </div>

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
          onSortChange={(value) => updateFilter("sort", value)}
        />
      </div>
    </AppContainer>
  );
}
