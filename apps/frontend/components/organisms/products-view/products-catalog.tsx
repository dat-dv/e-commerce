"use client";

import { ListingProductsToolbar } from "@/app/(main)/products/products-toolbar";
import { ProductGrid } from "@/components/molecules/product-grid";
import EmptyState from "@/components/molecules/empty-space";
import { Pagination } from "@/components/molecules/pagination";
import { Search } from "lucide-react";
import { TProduct } from "@/domain/products/types/products.model";
import { AppliedFilters, AppliedFiltersBar } from "./applied-filters-bar";

interface ProductsCatalogProps<T extends string = string> {
  products: TProduct[];
  total: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  pageStr: string | null;
  categoryTitle: string;
  appliedFilters?: AppliedFilters;
  onClearFilter?: (key: T) => void;
  onResetFilters?: () => void;
  onPageChange?: (page: number) => void;
  onSortChange?: (sort: string) => void;
}

export function ProductsCatalog<T extends string = string>({
  products,
  total,
  currentPage,
  totalPages,
  loading,
  pageStr,
  categoryTitle,
  appliedFilters,
  onClearFilter,
  onResetFilters,
  onPageChange,
  onSortChange,
}: ProductsCatalogProps<T>) {
  const hasProducts = products.length > 0;

  return (
    <div className="lg:col-span-3">
      <ListingProductsToolbar
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={loading}
        onPageChange={onPageChange}
        onSortChange={onSortChange}
      />
      {appliedFilters && onClearFilter && onResetFilters && (
        <AppliedFiltersBar<T>
          filters={appliedFilters}
          onClearFilter={onClearFilter}
          onResetFilters={onResetFilters}
        />
      )}

      {hasProducts || loading ? (
        <div className="flex flex-col gap-12">
          <ProductGrid
            products={products}
            loading={loading}
            gridClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          />

          {totalPages > 1 && !loading && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={pageStr ? parseInt(pageStr) : 1}
                totalPages={totalPages}
                queryParam={onPageChange ? undefined : "page"}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="No products found"
          description={`No products found in category "${categoryTitle}" matching your criteria.`}
          icon={Search}
        />
      )}
    </div>
  );
}
