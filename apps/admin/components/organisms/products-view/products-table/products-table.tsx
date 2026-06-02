"use client";

import { type IProductResponse } from "@ecommerce/shared";
import {
  Button,
  type CommonTableColumn,
  TableCommon,
  type TableQuery,
  type TableSortDirection,
} from "@ecommerce/ui";
import { Eye, Package, Star } from "lucide-react";
import { useState } from "react";

import {
  formatCurrency,
  getProductName,
  getProductStatus,
} from "@/components/organisms/products-view/product.utils";

interface IProductsTableProps {
  products: IProductResponse[];
  loading?: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onViewDetail: (product: IProductResponse) => void;
}

export const ProductsTable = ({
  products,
  loading = false,
  error,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  onViewDetail,
}: IProductsTableProps) => {
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortDirection, setSortDirection] = useState<TableSortDirection>();

  const handleQueryChange = (nextQuery: TableQuery) => {
    console.log("Products table query change", nextQuery);
    setSortColumn(nextQuery.sortColumn);
    setSortDirection(nextQuery.sortDirection);

    if (nextQuery.pageSize !== pageSize) {
      onPageSizeChange(nextQuery.pageSize);
      return;
    }

    if (nextQuery.page !== page) {
      onPageChange(nextQuery.page);
    }
  };

  const columns: CommonTableColumn<IProductResponse>[] = [
    {
      key: "product",
      header: "Product",
      sortable: true,
      resizable: true,
      renderItem: ({ item: product }) => {
        const name = getProductName(product.translations, product.slug);
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-white/5">
              {product.thumbnail?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.thumbnail.url}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package className="h-5 w-5 text-[var(--muted)]" />
              )}
            </div>
            <span className="max-w-[180px] truncate font-semibold text-[var(--app-text)]">
              {name}
            </span>
          </div>
        );
      },
    },
    {
      key: "slug",
      header: "Slug",
      sortable: true,
      resizable: true,
      renderItem: ({ item: product }) => (
        <code className="text-xs text-[var(--muted)]">{product.slug}</code>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      resizable: true,
      renderItem: ({ item: product }) => {
        const statusInfo = getProductStatus(product.status);
        return (
          <span
            className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-semibold ${statusInfo.color}`}
          >
            {statusInfo.label}
          </span>
        );
      },
    },
    {
      key: "base_price",
      header: "Price",
      sortable: true,
      resizable: true,
      renderItem: ({ item: product }) => formatCurrency(product.base_price),
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      resizable: true,
      renderItem: ({ item: product }) => (
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-[var(--app-text)]">
            {product.rating.toFixed(1)}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      width: 50,
      className: "text-right",
      renderItem: ({ item: product }) => {
        const name = getProductName(product.translations, product.slug);
        return (
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail(product);
            }}
            className="hover:bg-primary inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors hover:text-white"
            aria-label={`View product ${name}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <TableCommon<IProductResponse>
        name="admin-products"
        data={products}
        columns={columns}
        loading={loading}
        error={error}
        total={total}
        page={page}
        pageSize={pageSize}
        showIndex
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onQueryChange={handleQueryChange}
        emptyState="No products found."
      />
    </div>
  );
};

ProductsTable.displayName = "ProductsTable";
