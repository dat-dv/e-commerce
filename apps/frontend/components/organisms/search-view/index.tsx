"use client";

import AppContainer from "@/components/atoms/app-container";
import { FilterDrawerTrigger } from "@/components/molecules/filter-drawer-trigger";
import { ProductFilterDrawer } from "@/components/molecules/product-filter-drawer";
import { ProductFilterSidebar } from "@/components/molecules/product-filter-sidebar";
import { ProductsHeader } from "@/components/molecules/products-header";
import {
  RenderDesktopOnly,
  RenderTabletAndBelow,
} from "@/components/molecules/responsive";
import { DiscoveryCarouselSection } from "@/components/organisms/discovery-sections";
import { ProductsCatalog } from "@/components/organisms/products-view/products-catalog";
import { TProduct } from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";
import { usePagination } from "@/hooks/use-pagination";
import { IPaginationMeta } from "@/utils/request/request.types";
import { useState } from "react";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface SearchViewProps {
  searchQuery: string;
  initialData: {
    items: TProduct[];
    meta: IPaginationMeta;
  };
}

type SearchQueryParams = {
  page: number;
  limit: number;
  sort: string | null;
  search: string | null;
  category_slug: string | null;
  min_price: string | null;
  max_price: string | null;
  rating: string | null;
};

export function SearchView({ searchQuery, initialData }: SearchViewProps) {
  const categories = useCategoriesStore((s) => s.categories);
  const t = useTranslations("SearchView");
  const tProducts = useTranslations("ProductsPage");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    items: products,
    meta,
    totalPages,
    loading,
    loadPage,
    routerState,
    update,
    reset,
  } = usePagination<TProduct, SearchQueryParams>({
    initialData,
    syncUrlParams: true,
    fetchPage: (params) =>
      productsUseCase.getProducts.execute({
        page: params.page,
        limit: params.limit,
        sort: params.sort || undefined,
        search: params.search || undefined,
        category_slug: params.category_slug || undefined,
        min_price: params.min_price ? parseInt(params.min_price) : undefined,
        max_price: params.max_price ? parseInt(params.max_price) : undefined,
        rating: params.rating ? parseInt(params.rating) : undefined,
      }),
  });

  const updateFilter = (
    filters: {
      key: Exclude<keyof SearchQueryParams, "page" | "limit">;
      value: string | null;
    }[],
  ) => {
    const nextParams: Partial<SearchQueryParams> = {};
    filters.forEach(({ key, value }) => {
      nextParams[key] = value;
    });
    loadPage(1, nextParams);
  };

  const router = useRouter();
  const handleClearFilterItem = (key: string) => {
    if (key === "search") {
      router.push("/search");
      return;
    }
    update({ [key]: null });
  };

  const handleClearAllFilter = () => {
    router.push("/search");
  };

  const activeCategory = categories.find(
    (c) => c.slug === routerState.category_slug,
  );
  const categoryLabel = activeCategory?.name || routerState.category_slug;

  const shortQuery =
    searchQuery.length > 30
      ? searchQuery.substring(0, 30) + "..."
      : searchQuery;

  return (
    <AppContainer size="2xl" className="py-12 md:py-16">
      <ProductsHeader
        title={
          searchQuery
            ? t("titleWithQuery", { query: shortQuery })
            : t("titleWithoutQuery")
        }
        description={t("description", { total: meta.total })}
      />
      <RenderTabletAndBelow>
        <FilterDrawerTrigger
          eyebrow={tProducts("filters")}
          label={searchQuery || t("titleWithoutQuery")}
          buttonLabel={tProducts("filterButton")}
          onPress={() => setIsFilterOpen(true)}
        />
      </RenderTabletAndBelow>

      <div className="mb-24 grid grid-cols-1 gap-8 lg:grid-cols-4">
        <RenderDesktopOnly>
          <div className="col-span-1">
            <ProductFilterSidebar
              categories={categories}
              onFilterChange={updateFilter}
              onCategoryChange={(slug) => loadPage(1, { category_slug: slug })}
              initialSearchValue={routerState.search || ""}
              onSearchSubmit={(val) =>
                updateFilter([{ key: "search", value: val }])
              }
              minPriceValue={routerState.min_price || ""}
              maxPriceValue={routerState.max_price || ""}
              ratingValue={routerState.rating || ""}
              activeSlug={routerState.category_slug || ""}
            />
          </div>
        </RenderDesktopOnly>

        <ProductsCatalog
          products={products}
          total={meta.total}
          currentPage={meta.page}
          totalPages={totalPages}
          loading={loading}
          pageStr={String(meta.page)}
          categoryTitle={shortQuery}
          appliedFilters={{
            search: searchQuery,
            sort: routerState.sort ? String(routerState.sort) : undefined,
            min_price: routerState.min_price
              ? Number(routerState.min_price)
              : undefined,
            max_price: routerState.max_price
              ? Number(routerState.max_price)
              : undefined,
            rating: routerState.rating ? Number(routerState.rating) : undefined,
            category_slug: categoryLabel || undefined,
          }}
          onClearFilter={handleClearFilterItem}
          onResetFilters={handleClearAllFilter}
          onPageChange={loadPage}
          onSortChange={(sortVal) => loadPage(1, { sort: sortVal })}
        />
      </div>

      <RenderTabletAndBelow>
        <ProductFilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          categories={categories}
          onFilterChange={updateFilter}
          onCategoryChange={(slug) => loadPage(1, { category_slug: slug })}
          hideCategories={false}
          minPriceValue={routerState.min_price || ""}
          maxPriceValue={routerState.max_price || ""}
          ratingValue={routerState.rating || ""}
          activeSlug={routerState.category_slug || ""}
        />
      </RenderTabletAndBelow>
      {/* Discovery Sections */}
      <DiscoveryCarouselSection />
    </AppContainer>
  );
}
