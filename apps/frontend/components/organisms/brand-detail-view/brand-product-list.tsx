"use client";

import { FilterDrawerTrigger } from "@/components/molecules/filter-drawer-trigger";
import { ProductFilterSidebar } from "@/components/molecules/product-filter-sidebar";
import {
  RenderDesktopOnly,
  RenderTabletAndBelow,
} from "@/components/molecules/responsive";
import { ProductsCatalog } from "@/components/organisms/products-view/products-catalog";
import { TCategory } from "@/domain/categories/types/categories.model";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { TProduct } from "@/domain/products/types/products.model";
import {
  BrandProductsFilterKey,
  useBrandProductsFilter,
} from "@/hooks/brands/use-brand-products-filter";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BrandFilterDrawer } from "./brand-filter-drawer";
import { BrandProductHeader } from "./brand-product-header";

interface IBrandProductListSection {
  brand: TBrand;
  products: TProduct[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  searchQuery?: string;
  categories: TCategory[];
  categorySlug?: string;
}

export function BrandProductListSection({
  brand,
  products,
  currentPage,
  totalPages,
  totalProducts,
  searchQuery = "",
  categories,
}: IBrandProductListSection) {
  const tProducts = useTranslations("ProductsPage");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    filterMinPrice,
    filterMaxPrice,
    filterRating,
    filterSort,
    categorySlug,
    updateFilter,
    navigateToCategory,
    submitSearch,
    clearFilter,
    resetFilters,
    changePage,
  } = useBrandProductsFilter();

  const findCategoryBySlug = (
    cats: TCategory[],
    slug: string,
  ): TCategory | undefined => {
    if (!cats || !slug) return undefined;
    const targetSlug = slug.toLowerCase().trim();
    for (const cat of cats) {
      if (cat.slug.toLowerCase().trim() === targetSlug) {
        return cat;
      }
      if (cat.children && cat.children.length > 0) {
        const found = findCategoryBySlug(cat.children, slug);
        if (found) return found;
      }
    }
    return undefined;
  };

  const activeCategory = findCategoryBySlug(categories, categorySlug);
  const categoryTitle = activeCategory?.name || brand.name;

  const handleDrawerCategoryChange = (slug: string) => {
    setIsFilterOpen(false);
    navigateToCategory(slug);
  };

  return (
    <section className="flex flex-col gap-12">
      <BrandProductHeader brand={brand} />

      <RenderTabletAndBelow>
        <FilterDrawerTrigger
          eyebrow={tProducts("filters")}
          label={categoryTitle}
          buttonLabel={tProducts("filterButton")}
          onPress={() => setIsFilterOpen(true)}
        />
      </RenderTabletAndBelow>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <RenderDesktopOnly>
          <div className="col-span-1">
            <ProductFilterSidebar<BrandProductsFilterKey>
              categories={categories}
              onFilterChange={updateFilter}
              onCategoryChange={navigateToCategory}
              initialSearchValue={searchQuery}
              searchPlaceholder={`Search ${brand.name}`}
              onSearchSubmit={submitSearch}
              minPriceValue={filterMinPrice}
              maxPriceValue={filterMaxPrice}
              ratingValue={filterRating}
              activeSlug={categorySlug}
            />
          </div>
        </RenderDesktopOnly>

        <ProductsCatalog<BrandProductsFilterKey>
          products={products}
          total={totalProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={false}
          pageStr={String(currentPage)}
          categoryTitle={categoryTitle}
          appliedFilters={{
            search: searchQuery || undefined,
            sort: filterSort || undefined,
            min_price: filterMinPrice ? Number(filterMinPrice) : undefined,
            max_price: filterMaxPrice ? Number(filterMaxPrice) : undefined,
            rating: filterRating ? Number(filterRating) : undefined,
            category_slug: activeCategory?.name || undefined,
          }}
          onClearFilter={clearFilter}
          onResetFilters={resetFilters}
          onPageChange={changePage}
          onSortChange={(value) => updateFilter([{ key: "sort", value }])}
        />
      </div>

      {/* Mobile/Tablet filter drawer */}
      <RenderTabletAndBelow>
        <BrandFilterDrawer<BrandProductsFilterKey>
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          categories={categories}
          onFilterChange={updateFilter}
          onCategoryChange={handleDrawerCategoryChange}
          initialSearchValue={searchQuery}
          searchPlaceholder={`Search ${brand.name}`}
          onSearchSubmit={submitSearch}
          minPriceValue={filterMinPrice}
          maxPriceValue={filterMaxPrice}
          ratingValue={filterRating}
          activeSlug={categorySlug}
        />
      </RenderTabletAndBelow>
    </section>
  );
}
