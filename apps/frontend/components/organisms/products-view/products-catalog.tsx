"use client";

import {
  AppliedFilters,
  AppliedFiltersBar,
} from "@/components/molecules/applied-filters-bar";
import { ProductListingContent } from "@/components/molecules/product-listing-content";
import { ListingProductsToolbar } from "@/components/molecules/products-toolbar";
import { TProduct } from "@/domain/products/types/products.model";

import { useTranslations } from "next-intl";

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
  const t = useTranslations("ProductsPage");
  const currentPaginationPage = pageStr ? parseInt(pageStr) : 1;

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

      <ProductListingContent
        products={products}
        loading={loading}
        totalPages={totalPages}
        currentPage={currentPaginationPage}
        queryParam={onPageChange ? undefined : "page"}
        onPageChange={onPageChange}
        emptyTitle={t("noProducts")}
        emptyDescription={t("noProductsDesc", { categoryTitle })}
      />
    </div>
  );
}
