"use client";

import { SearchInput } from "@ecommerce/ui";
import React from "react";

import { ProductDetailDialog } from "./product-detail-dialog";
import { ProductsHeader } from "./products-header";
import { ProductsTable } from "./products-table";
import { useProductsView } from "./use-products-view";

export const ProductsView = () => {
  const {
    error,
    searchQuery,
    page,
    total,
    totalPages,
    selectedProduct,
    isDetailOpen,
    filteredProducts,
    setPage,
    setSearchQuery,
    setIsDetailOpen,
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
        error={error}
        page={page}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onViewDetail={handleViewDetail}
      />

      <ProductDetailDialog
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

ProductsView.displayName = "ProductsView";
