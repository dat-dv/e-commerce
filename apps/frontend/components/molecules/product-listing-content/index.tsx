"use client";
import { EmptyState } from "@ecommerce/ui";

import { Pagination } from "@/components/molecules/pagination";
import { ProductGrid } from "@/components/molecules/product-grid";
import { LucideIcon, Search } from "lucide-react";
import { TProduct } from "@/domain/products/types/products.model";

interface ProductListingContentProps {
  products: TProduct[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  emptyTitle: string;
  emptyDescription: string;
  emptyIcon?: LucideIcon;
  queryParam?: string;
  onPageChange?: (page: number) => void;
}

export function ProductListingContent({
  products,
  loading,
  totalPages,
  currentPage,
  emptyTitle,
  emptyDescription,
  emptyIcon = Search,
  queryParam,
  onPageChange,
}: ProductListingContentProps) {
  const hasProducts = products.length > 0;

  if (!hasProducts && !loading) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
      />
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <ProductGrid products={products} loading={loading} />

      {totalPages > 1 && !loading ? (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            queryParam={queryParam}
            onPageChange={onPageChange}
          />
        </div>
      ) : null}
    </div>
  );
}

export default ProductListingContent;
