"use client";

import { SearchInput } from "@ecommerce/ui";
import React from "react";

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

      {/* Search bar */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 shadow-xl backdrop-blur-xl">
        <SearchInput
          placeholder="Search by product name or slug..."
          value={searchQuery}
          onSearch={(q) => setSearchQuery(q)}
          onChange={(q) => setSearchQuery(q)}
          showSubmitButton={false}
          className="w-full"
        />
      </div>

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
