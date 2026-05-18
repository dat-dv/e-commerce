"use client";

import { TProduct } from "@/domain/products/types/products.model";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { TCategory } from "@/domain/categories/types/categories.model";
import { ProductsFilterSidebar } from "@/components/organisms/products-view/products-filter-sidebar";
import { ProductsCatalog } from "@/components/organisms/products-view/products-catalog";
import {
  useBrandProductsFilter,
  BrandProductsFilterKey,
} from "@/hooks/brands/use-brand-products-filter";

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

  // Find active category recursively with safety and case-insensitivity
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

  return (
    <section className="flex flex-col gap-12">
      {/* Editorial  Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-content/10 pb-12">
        <div className="flex flex-col gap-4">
          <h2 className="text-5xl font-black tracking-tighter text-content uppercase">
            {brand.name}{" "}
            <span className="italic font-light text-content/30">Archive</span>
          </h2>
        </div>
        <p className="text-content/50 font-medium max-w-xs text-sm italic">
          {"Experience the pinnacle of craftsmanship through our curated selection of " +
            brand.name +
            " products."}
        </p>
      </div>

      {/* Premium Side-by-Side Filtering Layout (Identical to Category Detail) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ProductsFilterSidebar<BrandProductsFilterKey>
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
            category: activeCategory?.name || undefined,
          }}
          onClearFilter={clearFilter}
          onResetFilters={resetFilters}
          onPageChange={changePage}
          onSortChange={(value) => updateFilter("sort", value)}
        />
      </div>
    </section>
  );
}
