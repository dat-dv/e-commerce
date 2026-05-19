"use client";

import { ListingProductsToolbar } from "@/components/molecules/products-toolbar";
import { ProductGrid } from "@/components/molecules/product-grid";
import EmptyState from "@/components/molecules/empty-space";
import { Pagination } from "@/components/molecules/pagination";
import { Search } from "lucide-react";
import { TProduct } from "@/domain/products/types/products.model";

import { useTranslations } from "next-intl";

interface SearchProductListProps {
  products: TProduct[];
  total: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  pageStr: string | null;
  shortQuery: string;
}

export function SearchProductList({
  products,
  total,
  currentPage,
  totalPages,
  loading,
  pageStr,
  shortQuery,
}: SearchProductListProps) {
  const hasProducts = products.length > 0;
  const t = useTranslations("SearchView");

  return (
    <div className="lg:col-span-3">
      <ListingProductsToolbar
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={loading}
      />

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
                queryParam="page"
              />
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title={t("noResultsTitle")}
          description={t("noResultsDescription", { query: shortQuery })}
          icon={Search}
        />
      )}
    </div>
  );
}
