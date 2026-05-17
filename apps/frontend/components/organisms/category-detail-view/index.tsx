"use client";

import AppContainer from "@/components/atoms/app-container";
import { ProductsHeader } from "@/app/(main)/products/products-header";
import { ProductsFilterSidebar } from "@/components/organisms/products-view/products-filter-sidebar";
import { ProductsCatalog } from "@/components/organisms/products-view/products-catalog";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";
import { useCategoryProductsAdapter } from "@/hooks/categories/use-category-products-adapter";
import { useCategoryProductsStore } from "@/hooks/categories/use-category-products-store";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

interface CategoryDetailViewProps {
  categorySlug: string;
}

const NUMERIC_FILTER_KEYS = ["min_price", "max_price", "rating"];

export function CategoryDetailView({ categorySlug }: CategoryDetailViewProps) {
  const router = useRouter();

  const { categories, getCategoryNavigationContext } = useCategoriesStore(
    useShallow((state) => ({
      categories: state.categories,
      getCategoryNavigationContext: state.getCategoryNavigationContext,
    })),
  );

  const {
    products,
    total,
    currentPage,
    totalPages,
    loading,
    filterSearch,
    filterSort,
    filterMinPrice,
    filterMaxPrice,
    filterRating,
  } = useCategoryProductsStore(
    useShallow((state) => ({
      products: state.products,
      total: state.total,
      currentPage: state.currentPage,
      totalPages: state.totalPages,
      loading: state.loading,
      filterSearch: state.search,
      filterSort: state.sort,
      filterMinPrice: state.min_price,
      filterMaxPrice: state.max_price,
      filterRating: state.rating,
    })),
  );

  const { applyFilters, changePage, clearFilter, resetFilters } =
    useCategoryProductsAdapter(categorySlug);

  const { activeCategory, topCategory } = useMemo(
    () => getCategoryNavigationContext(categorySlug),
    [categorySlug, getCategoryNavigationContext],
  );

  const displayCategories = topCategory ? [topCategory] : categories;
  const categoryTitle = activeCategory?.name || "Products";

  const updateFilter = (key: string, value: string | null) => {
    const parsedValue =
      value && NUMERIC_FILTER_KEYS.includes(key)
        ? Number(value)
        : value || undefined;

    applyFilters({
      [key]: parsedValue,
    });
  };

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

  const submitSearch = (value: string) => {
    applyFilters({
      search: value.trim() || undefined,
    });
  };

  return (
    <AppContainer size="2xl" className="py-16">
      <ProductsHeader
        title={categoryTitle}
        description={`Explore our finest selection of ${categoryTitle}. Handpicked for quality, price, and availability.`}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ProductsFilterSidebar
            categories={displayCategories}
            onFilterChange={updateFilter}
            onCategoryChange={navigateToCategory}
            initialSearchValue={filterSearch}
            searchPlaceholder={`Search ${categoryTitle}`}
            onSearchSubmit={submitSearch}
            minPriceValue={
              filterMinPrice !== undefined ? String(filterMinPrice) : ""
            }
            maxPriceValue={
              filterMaxPrice !== undefined ? String(filterMaxPrice) : ""
            }
            ratingValue={filterRating !== undefined ? String(filterRating) : ""}
            activeSlug={categorySlug}
          />
        </div>

        <ProductsCatalog
          products={products}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          pageStr={String(currentPage)}
          categoryTitle={categoryTitle}
          appliedFilters={{
            search: filterSearch,
            sort: filterSort ? String(filterSort) : undefined,
            min_price: filterMinPrice,
            max_price: filterMaxPrice,
            rating: filterRating,
          }}
          onClearFilter={clearFilter}
          onResetFilters={resetFilters}
          onPageChange={changePage}
        />
      </div>
    </AppContainer>
  );
}
