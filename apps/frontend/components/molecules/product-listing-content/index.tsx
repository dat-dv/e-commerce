"use client";

import { EmptyState, Pagination } from "@ecommerce/ui";
import { ProductGrid } from "@/components/molecules/product-grid";
import { LucideIcon, Search } from "lucide-react";
import { TProduct } from "@/domain/products/types/products.model";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const hasProducts = products.length > 0;

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
      return;
    }
    if (queryParam) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(queryParam, page.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

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
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </div>
  );
}

export default ProductListingContent;
