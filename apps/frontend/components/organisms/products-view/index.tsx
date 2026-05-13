"use client";

import React, { useEffect } from "react";
import AppContainer from "@/components/atoms/app-container";
import { ProductCard } from "@/components/molecules/product-card";
import { ProductsHeader } from "@/app/(main)/products/products-header";
import { FilterSidebar } from "@/app/(main)/products/filter-sidebar";
import { ProductsToolbar } from "@/app/(main)/products/products-toolbar";
import { useProductsPageStore } from "@/hooks/products/use-products-page-store";
import { TCategory } from "@/domain/categories/types/categories.model";
import { Search } from "lucide-react";

interface ProductsViewProps {
  categories: TCategory[];
}

export function ProductsView({ categories }: ProductsViewProps) {
  const {
    products,
    total,
    currentPage,
    totalPages,
    loading,
    category_id,
    sort,
    search,
    min_price,
    max_price,
  } = useProductsPageStore((state) => state);

  // Here we would add useEffect to fetch data when filters change on client
  // For now, let's just render the UI

  return (
    <AppContainer size="2xl" className="py-16">
      <ProductsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <FilterSidebar categories={categories} />
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
