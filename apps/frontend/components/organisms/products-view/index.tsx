"use client";

import AppContainer from "@/components/atoms/app-container";
import { ProductCard } from "@/components/molecules/product-card";
import { ProductsHeader } from "@/app/(main)/products/products-header";
import { FilterSidebar } from "@/app/(main)/products/filter-sidebar";
import { ProductsToolbar } from "@/app/(main)/products/products-toolbar";
import { useProductsPageStore } from "@/hooks/products/use-products-page-store";
import { useProductsAdapter } from "@/hooks/products/use-products-adapter";
import { TCategory } from "@/domain/categories/types/categories.model";
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

interface ProductsViewProps {
  categories: TCategory[];
  categorySlug: string;
}

export function ProductsView({ categories, categorySlug }: ProductsViewProps) {
  const { products, total, currentPage, totalPages, loading } =
    useProductsPageStore((state) => state);

  const { fetchProducts } = useProductsAdapter();

  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const sort = searchParams.get("sort");
  const search = searchParams.get("search");

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
      sort: sort || "newest",
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
  // Nếu đang ở một category cụ thể, chỉ hiển thị tree của category đó
  const displayCategories = activeCategory ? [activeCategory] : categories;

  return (
    <AppContainer size="2xl" className="py-16">
      <ProductsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <FilterSidebar categories={displayCategories} />
        </div>

        {/* Products Area */}
        <div className="lg:col-span-3">
          <ProductsToolbar
            total={total}
            currentPage={currentPage}
            totalPages={totalPages}
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
        </div>
      </div>
    </AppContainer>
  );
}
