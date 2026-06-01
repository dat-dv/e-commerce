import { type IProductResponse } from "@ecommerce/shared";
import {
  Button,
  type ITableColumn,
  Pagination,
  TableCommon,
} from "@ecommerce/ui";
import { Eye, Package, Star } from "lucide-react";

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
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetail: (product: IProductResponse) => void;
}

export const ProductsTable = ({
  products,
  loading = false,
  error,
  page,
  total,
  totalPages,
  onPageChange,
  onViewDetail,
}: IProductsTableProps) => {
  const columns: ITableColumn<IProductResponse>[] = [
    {
      key: "product",
      header: "Product",
      render: (product) => {
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
      render: (product) => (
        <code className="text-xs text-[var(--muted)]">{product.slug}</code>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (product) => {
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
      render: (product) => formatCurrency(product.base_price),
    },
    {
      key: "rating",
      header: "Rating",
      render: (product) => (
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
      className: "text-right",
      render: (product) => {
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
        data={products}
        columns={columns}
        loading={loading}
        error={error}
        onRowClick={onViewDetail}
        emptyState="No products found."
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="w-auto py-0"
      />
    </div>
  );
};

ProductsTable.displayName = "ProductsTable";
