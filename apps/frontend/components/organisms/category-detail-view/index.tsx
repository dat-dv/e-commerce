"use client";

import AppContainer from "@/components/atoms/app-container";
import { FilterDrawerTrigger } from "@/components/molecules/filter-drawer-trigger";
import { ProductsHeader } from "@/components/molecules/products-header";
import {
  RenderDesktopOnly,
  RenderTabletAndBelow,
} from "@/components/molecules/responsive";
import { ProductsCatalog } from "@/components/organisms/products-view/products-catalog";
import { TProduct } from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";
import { usePagination } from "@/hooks/use-pagination";
import { IPaginationMeta } from "@/utils/request/request.types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { CategoryDetailSidebar } from "./category-detail-sidebar";
import { CategoryFilterDrawer } from "./category-filter-drawer";

interface CategoryDetailViewProps {
  categorySlug: string;
  initialData: {
    items: TProduct[];
    meta: IPaginationMeta;
  };
}

type CategoryProductsFilterKey =
  | "search"
  | "sort"
  | "min_price"
  | "max_price"
  | "rating";

type CategoryProductsQueryParams = {
  page: number;
  limit: number;
  search: string | null;
  sort: string | null;
  min_price: string | null;
  max_price: string | null;
  rating: string | null;
};

export function CategoryDetailView({
  categorySlug,
  initialData,
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
    items: products,
    meta,
    totalPages,
    loading,
    loadPage,
    routerState,
  } = usePagination<TProduct, CategoryProductsQueryParams>({
    initialData,
    syncUrlParams: true,
    fetchPage: (params) =>
      productsUseCase.getProducts.execute({
        page: params.page,
        limit: params.limit,
        category_slug: categorySlug,
        sort: params.sort || undefined,
        search: params.search || undefined,
        min_price: params.min_price ? Number(params.min_price) : undefined,
        max_price: params.max_price ? Number(params.max_price) : undefined,
        rating: params.rating ? Number(params.rating) : undefined,
      }),
  });

  const { activeCategory, topCategory } = useMemo(
    () => getCategoryNavigationContext(categorySlug),
    [categorySlug, getCategoryNavigationContext],
  );

  const displayCategories = topCategory ? [topCategory] : categories;
  const categoryTitle = activeCategory?.name || t("fallbackTitle");

  const updateFilter = (
    filters: { key: CategoryProductsFilterKey; value: string | null }[],
  ) => {
    const nextParams: Partial<CategoryProductsQueryParams> = {};

    filters.forEach(({ key, value }) => {
      nextParams[key] = value;
    });

    loadPage(1, nextParams);
  };

  const clearFilter = (key: CategoryProductsFilterKey) => {
    loadPage(1, { [key]: null } as Partial<CategoryProductsQueryParams>);
  };

  const resetFilters = () => {
    loadPage(1, {
      search: null,
      sort: null,
      min_price: null,
      max_price: null,
      rating: null,
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
            <CategoryDetailSidebar
              categorySlug={categorySlug}
              categories={displayCategories}
              onFilterChange={updateFilter}
              onCategoryChange={navigateToCategory}
              minPriceValue={routerState.min_price || ""}
              maxPriceValue={routerState.max_price || ""}
              ratingValue={routerState.rating || ""}
            />
          </div>
        </RenderDesktopOnly>

        <ProductsCatalog<CategoryProductsFilterKey>
          products={products}
          total={meta.total}
          currentPage={meta.page}
          totalPages={totalPages}
          loading={loading}
          pageStr={String(meta.page)}
          categoryTitle={categoryTitle}
          appliedFilters={{
            search: routerState.search || undefined,
            sort: routerState.sort ? String(routerState.sort) : undefined,
            min_price: routerState.min_price
              ? Number(routerState.min_price)
              : undefined,
            max_price: routerState.max_price
              ? Number(routerState.max_price)
              : undefined,
            rating: routerState.rating ? Number(routerState.rating) : undefined,
          }}
          onClearFilter={clearFilter}
          onResetFilters={resetFilters}
          onPageChange={loadPage}
          onSortChange={(value) => updateFilter([{ key: "sort", value }])}
        />
      </div>

      <RenderTabletAndBelow>
        <CategoryFilterDrawer<CategoryProductsFilterKey>
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          categories={displayCategories}
          onFilterChange={updateFilter}
          onCategoryChange={handleDrawerCategoryChange}
          minPriceValue={routerState.min_price || ""}
          maxPriceValue={routerState.max_price || ""}
          ratingValue={routerState.rating || ""}
          activeSlug={categorySlug}
        />
      </RenderTabletAndBelow>
    </AppContainer>
  );
}
