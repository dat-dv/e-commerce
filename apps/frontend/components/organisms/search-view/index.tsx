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
import usePagination from "@/hooks/use-pagination";
import { PaginatedInitialData } from "@/utils/request/request.types";
import { useState } from "react";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface SearchViewProps {
  searchQuery: string;
  initialData: PaginatedInitialData<TProduct>;
}

type SearchQueryParams = {
  page: number;
  limit: number;
  search: string;
  sort: string;
  category_slug: string;
  min_price: string;
  max_price: string;
  rating: string;
};

export function SearchView({ searchQuery, initialData }: SearchViewProps) {
  const categories = useCategoriesStore((s) => s.categories);
  const t = useTranslations("SearchView");
  const tProducts = useTranslations("ProductsPage");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

  const {
    data,
    loading,
    getData,
    router: paginationRouter,
  } = usePagination<TProduct, SearchQueryParams>({
    initialData,
    isSyncWithSearchParams: true,
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
    const nextParams = Object.fromEntries(
      filters.map(({ key, value }) => [key, value]),
    ) as Partial<SearchQueryParams>;

    getData({ page: 1, ...nextParams });
  };

  const handleClearFilterItem = (key: string) => {
    if (key === "search") {
      router.push("/search");
      return;
    }
    getData({ page: 1, [key]: null } as Partial<SearchQueryParams>);
  };

  const handleClearAllFilter = () => {
    router.push("/search");
  };

  const activeCategory = categories.find(
    (c) => c.slug === paginationRouter.routerState.category_slug,
  );
  const categoryLabel =
    activeCategory?.name || paginationRouter.routerState.category_slug;

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
        description={t("description", { total: data.meta.total })}
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
              onCategoryChange={(slug) =>
                getData({ page: 1, category_slug: slug })
              }
              minPriceValue={paginationRouter.routerState.min_price || ""}
              maxPriceValue={paginationRouter.routerState.max_price || ""}
              ratingValue={paginationRouter.routerState.rating || ""}
              activeSlug={paginationRouter.routerState.category_slug || ""}
            />
          </div>
        </RenderDesktopOnly>

        <ProductsCatalog
          products={data.items}
          total={data.meta.total}
          currentPage={data.meta.page}
          totalPages={data.meta.totalPages}
          loading={loading}
          pageStr={String(data.meta.page)}
          categoryTitle={shortQuery}
          appliedFilters={{
            search: searchQuery,
            sort: paginationRouter.routerState.sort
              ? String(paginationRouter.routerState.sort)
              : undefined,
            min_price: paginationRouter.routerState.min_price
              ? Number(paginationRouter.routerState.min_price)
              : undefined,
            max_price: paginationRouter.routerState.max_price
              ? Number(paginationRouter.routerState.max_price)
              : undefined,
            rating: paginationRouter.routerState.rating
              ? Number(paginationRouter.routerState.rating)
              : undefined,
            category_slug: categoryLabel || undefined,
          }}
          onClearFilter={handleClearFilterItem}
          onResetFilters={handleClearAllFilter}
          onPageChange={(page) => getData({ page })}
          onSortChange={(sortVal) => getData({ page: 1, sort: sortVal })}
        />
      </div>

      <RenderTabletAndBelow>
        <ProductFilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          categories={categories}
          onFilterChange={updateFilter}
          onCategoryChange={(slug) => getData({ page: 1, category_slug: slug })}
          hideCategories={false}
          minPriceValue={paginationRouter.routerState.min_price || ""}
          maxPriceValue={paginationRouter.routerState.max_price || ""}
          ratingValue={paginationRouter.routerState.rating || ""}
          activeSlug={paginationRouter.routerState.category_slug || ""}
        />
      </RenderTabletAndBelow>
      {/* Discovery Sections */}
      <DiscoveryCarouselSection />
    </AppContainer>
  );
}
