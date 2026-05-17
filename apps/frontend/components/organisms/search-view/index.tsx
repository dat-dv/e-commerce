"use client";

import AppContainer from "@/components/atoms/app-container";
import { ProductsHeader } from "@/app/(main)/products/products-header";
import { useProductsPageStore } from "@/hooks/products/use-products-page-store";
import { useProductsAdapter } from "@/hooks/products/use-products-adapter";
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { EProductSort } from "@ecommerce/shared";
import { DiscoveryCarouselSection } from "@/components/organisms/discovery-sections";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { SearchSidebar } from "./search-sidebar";
import { SearchProductList } from "./search-product-list";

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

  const page = searchParams.get("page");
  const sort = searchParams.get("sort");

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== "page") params.set("page", "1");
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
        title={searchQuery ? `Results for "${shortQuery}"` : "Search Products"}
        description={`We found ${total} products matching your criteria.`}
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-24">
        <SearchSidebar
          categories={categories}
          onFilterChange={updateFilter}
          onCategoryChange={navigateToCategory}
        />

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
      {/* Discovery Sections */}
      <div className="pt-24 border-t border-content/[0.05]">
        <DiscoveryCarouselSection />
      </div>
    </AppContainer>
  );
}
