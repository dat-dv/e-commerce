"use client";

import {
  Button,
  type CommonTableColumn,
  TableCommon,
  type TableQuery,
  type TableSortDirection,
} from "@ecommerce/ui";
import { Eye, Star } from "lucide-react";
import { useState } from "react";

import { AdminThumbnail } from "@/components/atoms/admin-thumbnail";
import {
  formatCurrency,
  getProductStatus,
} from "@/components/organisms/products-view/product.utils";
import type { IAdminProduct } from "@/domain/product";

interface IProductsTableProps {
  products: IAdminProduct[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (
    sortColumn?: string,
    sortDirection?: TableSortDirection,
  ) => void;
  onViewDetail: (product: IAdminProduct) => void;
}

export const ProductsTable = ({
  products,
  loading = false,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onViewDetail,
}: IProductsTableProps) => {
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortDirection, setSortDirection] = useState<TableSortDirection>();

  const handleQueryChange = (nextQuery: TableQuery) => {
    const isSortChange =
      nextQuery.sortColumn !== sortColumn ||
      nextQuery.sortDirection !== sortDirection;

    setSortColumn(nextQuery.sortColumn);
    setSortDirection(nextQuery.sortDirection);

    if (isSortChange) {
      onSortChange(nextQuery.sortColumn, nextQuery.sortDirection);
      return;
    }

    if (nextQuery.pageSize !== pageSize) {
      onPageSizeChange(nextQuery.pageSize);
      return;
    }

    if (nextQuery.page !== page) {
      onPageChange(nextQuery.page);
    }
  };

  const columns: CommonTableColumn<IAdminProduct>[] = [
    {
      key: "product",
      header: "Product",
      resizable: true,
      renderItem: ({ item: product }) => {
        const name = product.translations?.[0]?.name ?? "-";
        return (
          <div className="flex items-center gap-3">
            <AdminThumbnail src={product.thumbnail?.url} alt={name} />
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
      resizable: true,
      renderItem: ({ item: product }) => (
        <code className="text-xs text-[var(--muted)]">{product.slug}</code>
      ),
    },
    {
      key: "status",
      header: "Status",
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
      key: "basePrice",
      header: "Price",
      sortable: true,
      resizable: true,
      renderItem: ({ item: product }) => formatCurrency(product.basePrice),
    },
    {
      key: "rating",
      header: "Rating",
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
        const name = product.translations?.[0]?.name ?? product.id;
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
      <TableCommon<IAdminProduct>
        name="admin-products"
        data={products}
        columns={columns}
        loading={loading}
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
