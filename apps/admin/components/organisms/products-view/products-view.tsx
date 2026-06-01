"use client";

import React from "react";

import { FilterBar } from "@/components/molecules/filter-bar";
import { ProductsHeader } from "@/components/molecules/products-header";
import { ProductsTable } from "@/components/organisms/products-view/products-table";
import { useProductsView } from "@/hooks/product/use-products-view";

export const ProductsView = () => {
  const {
    error,
    loading,
    searchQuery,
    page,
    total,
    totalPages,
    filteredProducts,
    setPage,
    setSearchQuery,
    handleViewDetail,
  } = useProductsView();

  return (
    <div className="space-y-6">
      <ProductsHeader total={total} />

      <FilterBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchPlaceholder="Search by product name or slug..."
      />

      <ProductsTable
        products={filteredProducts}
        loading={loading}
        error={error}
        page={page}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onViewDetail={handleViewDetail}
      />
    </div>
  );
};

ProductsView.displayName = "ProductsView";
