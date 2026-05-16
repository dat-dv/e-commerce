"use client";

import AppContainer from "@/components/atoms/app-container";
import { ProductCard } from "@/components/molecules/product-card";
import { ProductsHeader } from "@/app/(main)/products/products-header";
import { ProductsFilterSidebar } from "./products-filter-sidebar";
import { ListingProductsToolbar } from "@/app/(main)/products/products-toolbar";
import { useProductsPageStore } from "@/hooks/products/use-products-page-store";
import { useProductsAdapter } from "@/hooks/products/use-products-adapter";
import { TCategory } from "@/domain/categories/types/categories.model";
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Pagination } from "@/components/molecules/pagination";
import { EProductSort } from "@ecommerce/shared";

import { useCategoriesStore } from "@/hooks/categories/use-categories-store";

interface ProductsViewProps {
  categorySlug: string;
}

export function ProductsView({ categorySlug }: ProductsViewProps) {
  const categories = useCategoriesStore((s) => s.categories);
  const { products, total, currentPage, totalPages, loading } =
    useProductsPageStore((state) => state);

  const { fetchProducts } = useProductsAdapter();

  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page");
  const sort = searchParams.get("sort");
  const search = searchParams.get("search");

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") {
      params.set("page", "1");
    }
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const navigateToCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.push(`/categories/${slug}?${params.toString()}`);
  };

  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    fetchProducts({
      category_slug: categorySlug,
      page: page ? parseInt(page) : 1,
      limit: 56,
      sort: sort || EProductSort.DEFAULT.toString(),
      search: search || undefined,
    });
  }, [categorySlug, page, sort, search, fetchProducts]);

  // Tìm category cấp cao nhất chứa slug hiện tại
  const findTopLevelCategoryForSlug = (
    cats: TCategory[],
    slug: string,
  ): TCategory | null => {
    for (const cat of cats) {
      if (cat.slug === slug) return cat;
      if (cat.children) {
        const found = findTopLevelCategoryForSlug(cat.children, slug);
        if (found) return cat; // Trả về category cha cấp cao nhất
      }
    }
    return null;
  };

  const activeCategory = categorySlug
    ? findTopLevelCategoryForSlug(categories, categorySlug)
    : null;

  // Lấy tên category đang active để hiển thị lên Header
  const getActiveCategoryTitle = (
    cats: TCategory[],
    slug: string,
  ): string | null => {
    for (const cat of cats) {
      if (cat.slug === slug) return cat.name;
      if (cat.children) {
        const found = getActiveCategoryTitle(cat.children, slug);
        if (found) return found;
      }
    }
    return null;
  };

  const categoryTitle = categorySlug
    ? getActiveCategoryTitle(categories, categorySlug)
    : "Our Products";

  // Nếu đang ở một category cụ thể, chỉ hiển thị tree của category đó
  const displayCategories = activeCategory ? [activeCategory] : categories;

  return (
    <AppContainer size="2xl" className="py-16">
      <ProductsHeader
        title={categoryTitle || "Our Products"}
        description={`Explore our finest selection of ${categoryTitle || "premium products"}. Handpicked for quality and style.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ProductsFilterSidebar
            categories={displayCategories}
            onFilterChange={updateFilter}
            onCategoryChange={navigateToCategory}
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
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center py-16 bg-surface/80 border border-content/[0.05] backdrop-blur-md rounded-xl shadow-sm flex flex-col items-center gap-3">
              <Search className="w-8 h-8 text-content/20" />
              <p className="text-content/50 text-sm">No products found.</p>
            </div>
          )}

          {/* Pagination Section */}
          {!loading && totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={page ? parseInt(page) : 1}
                totalPages={totalPages}
                onPageChange={(p) => updateFilter("page", p.toString())}
              />
            </div>
          )}
        </div>
      </div>
    </AppContainer>
  );
}
