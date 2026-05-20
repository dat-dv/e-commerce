"use client";

import AppContainer from "@/components/atoms/app-container";
import { FilterDrawerTrigger } from "@/components/molecules/filter-drawer-trigger";
import { ProductFilterDrawer } from "@/components/molecules/product-filter-drawer";
import { ProductsHeader } from "@/components/molecules/products-header";
import {
  RenderDesktopOnly,
  RenderTabletAndBelow,
} from "@/components/molecules/responsive";
import { DiscoveryCarouselSection } from "@/components/organisms/discovery-sections";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";
import { useProductsAdapter } from "@/hooks/products/use-products-adapter";
import { useProductsPageStore } from "@/hooks/products/use-products-page-store";
import { EProductSort } from "@ecommerce/shared";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SearchProductList } from "./search-product-list";
import { SearchSidebar } from "./search-sidebar";

import { useTranslations } from "next-intl";

interface SearchViewProps {
  searchQuery: string;
}

export function SearchView({ searchQuery }: SearchViewProps) {
  const categories = useCategoriesStore((s) => s.categories);
  const { products, total, currentPage, totalPages, loading } =
    useProductsPageStore((state) => state);

  const { fetchProducts } = useProductsAdapter();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("SearchView");
  const tProducts = useTranslations("ProductsPage");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const page = searchParams.get("page");
  const sort = searchParams.get("sort");

  const updateFilter = (filters: { key: string; value: string | null }[]) => {
    const params = new URLSearchParams(searchParams.toString());
    filters.forEach(({ key, value }) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.set("page", "1");
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const navigateToCategory = (slug: string) => {
    router.push(`/categories/${slug}`);
  };

  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    fetchProducts({
      page: page ? parseInt(page) : 1,
      limit: PAGINATION_LIMITS.PRODUCTS,
      sort: sort || EProductSort.DEFAULT.toString(),
      search: searchQuery || undefined,
    });
  }, [page, sort, searchQuery, fetchProducts]);

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
        description={t("description", { total })}
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
          <SearchSidebar
            categories={categories}
            onFilterChange={updateFilter}
            onCategoryChange={navigateToCategory}
          />
        </RenderDesktopOnly>

        <SearchProductList
          products={products}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          pageStr={page}
          shortQuery={shortQuery}
        />
      </div>

      <RenderTabletAndBelow>
        <ProductFilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          categories={categories}
          onFilterChange={updateFilter}
          onCategoryChange={navigateToCategory}
          hideCategories={true}
          minPriceValue={searchParams.get("min_price") || ""}
          maxPriceValue={searchParams.get("max_price") || ""}
          ratingValue={searchParams.get("rating") || ""}
        />
      </RenderTabletAndBelow>
      {/* Discovery Sections */}
      <DiscoveryCarouselSection />
    </AppContainer>
  );
}
