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
import usePagination from "@/hooks/use-pagination";
import { PaginatedInitialData } from "@/utils/request/request.types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import DiscoveryCarouselSection from "../discovery-sections";
import { CategoryDetailSidebar } from "./category-detail-sidebar";
import { CategoryFilterDrawer } from "./category-filter-drawer";

interface CategoryDetailViewProps {
  categorySlug: string;
  initialData: PaginatedInitialData<TProduct>;
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
  search: string;
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
    data,
    loading,
    onChangePagination,
    onChangeFilter,
    onClearFilter,
    onResetFilters,
    router: paginationRouter,
  } = usePagination<TProduct, CategoryProductsQueryParams>({
    initialData,
    isSyncWithSearchParams: true,
    resetParams: {
      search: "",
      sort: null,
      min_price: null,
      max_price: null,
      rating: null,
    },
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

  const navigateToCategory = (slug: string) => {
    const current = new URLSearchParams(window.location.search);
    current.delete("page");
    const queryString = current.toString();
    router.push(
      queryString
        ? `/categories/${slug}?${queryString}`
        : `/categories/${slug}`,
      { scroll: false },
    );
  };
  const handleDrawerCategoryChange = (slug: string) => {
    setIsFilterOpen(false);
    navigateToCategory(slug);
  };

  return (
    <AppContainer size="2xl">
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
              onFilterChange={onChangeFilter}
              onCategoryChange={navigateToCategory}
              minPriceValue={paginationRouter.routerState.min_price || ""}
              maxPriceValue={paginationRouter.routerState.max_price || ""}
              ratingValue={paginationRouter.routerState.rating || ""}
            />
          </div>
        </RenderDesktopOnly>

        <ProductsCatalog<CategoryProductsFilterKey>
          products={data.items}
          total={data.meta.total}
          currentPage={data.meta.page}
          totalPages={data.meta.totalPages}
          loading={loading}
          pageStr={String(data.meta.page)}
          categoryTitle={categoryTitle}
          appliedFilters={{
            search: paginationRouter.routerState.search || undefined,
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
          }}
          onClearFilter={onClearFilter}
          onResetFilters={onResetFilters}
          onPageChange={onChangePagination}
          onSortChange={(value) => onChangeFilter([{ key: "sort", value }])}
          sortValue={paginationRouter.routerState.sort || ""}
        />
      </div>

      <RenderTabletAndBelow>
        <CategoryFilterDrawer<CategoryProductsFilterKey>
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          categories={displayCategories}
          onFilterChange={onChangeFilter}
          onCategoryChange={handleDrawerCategoryChange}
          minPriceValue={paginationRouter.routerState.min_price || ""}
          maxPriceValue={paginationRouter.routerState.max_price || ""}
          ratingValue={paginationRouter.routerState.rating || ""}
          activeSlug={categorySlug}
        />
      </RenderTabletAndBelow>

      <DiscoveryCarouselSection className="mt-12" />
    </AppContainer>
  );
}
