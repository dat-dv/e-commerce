"use client";

import { ListingProductsToolbar } from "@/components/molecules/products-toolbar";
import { ProductListingContent } from "@/components/molecules/product-listing-content";
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
  const t = useTranslations("SearchView");
  const currentPaginationPage = pageStr ? parseInt(pageStr) : 1;

  return (
    <div className="lg:col-span-3">
      <ListingProductsToolbar
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={loading}
      />

      <ProductListingContent
        products={products}
        loading={loading}
        totalPages={totalPages}
        currentPage={currentPaginationPage}
        queryParam="page"
        emptyTitle={t("noResultsTitle")}
        emptyDescription={t("noResultsDescription", { query: shortQuery })}
      />
    </div>
  );
}
