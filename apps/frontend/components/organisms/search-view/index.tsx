"use client";

import AppContainer from "@/components/atoms/app-container";
import { ProductCard } from "@/components/molecules/product-card";
import { ProductsHeader } from "@/app/(main)/products/products-header";
import { ProductsFilterSidebar } from "@/components/organisms/products-view/products-filter-sidebar";
import { ListingProductsToolbar } from "@/app/(main)/products/products-toolbar";
import { useProductsPageStore } from "@/hooks/products/use-products-page-store";
import { useProductsAdapter } from "@/hooks/products/use-products-adapter";
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Pagination } from "@/components/molecules/pagination";
import { EProductSort } from "@ecommerce/shared";
import { Recommendations } from "@/components/organisms/product-detail-view/recommendations";
import { useRecommendedProducts } from "@/hooks/products/use-recommended-products";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";

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

  const { recommendedProducts, isLoading } = useRecommendedProducts();

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
      limit: 24,
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
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ProductsFilterSidebar
            categories={categories}
            onFilterChange={updateFilter}
            onCategoryChange={navigateToCategory}
            hideCategories={true}
          />
        </div>

        {/* Products Area */}
        <div className="lg:col-span-3">
          <ListingProductsToolbar
            total={total}
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={loading}
          />

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-content/[0.03] rounded-2xl h-80"
                ></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : null}

          {products.length === 0 && !loading && (
            <div className="text-center py-24 bg-content/[0.02] border border-content/[0.05] rounded-[2rem] flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-content/[0.05] rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-content/30" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-content mb-2 tracking-tight">
                  No results found
                </h3>
                <p className="text-content/50 text-base max-w-md mx-auto">
                  {`We couldn't find anything matching "${shortQuery}". Try using
                  different keywords or browsing our categories.`}
                </p>
              </div>
            </div>
          )}

          {/* Pagination Section */}
          {!loading && totalPages > 1 && (
            <div className="mt-16 flex justify-center border-t border-content/[0.05] pt-8">
              <Pagination
                currentPage={page ? parseInt(page) : 1}
                totalPages={totalPages}
                onPageChange={(p) => updateFilter("page", p.toString())}
              />
            </div>
          )}
        </div>
      </div>

      {/* Recommended Section at bottom */}
      <div className="pt-24 border-t border-content/[0.05]">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-content mb-4">
            Curated For You
          </h2>
          <p className="text-content/60 max-w-2xl mx-auto">
            Discover our premium selection of highly rated products tailored to
            your aesthetic.
          </p>
        </div>
        <Recommendations
          recommendedProducts={recommendedProducts}
          loadingRecommended={isLoading}
        />
      </div>
    </AppContainer>
  );
}
