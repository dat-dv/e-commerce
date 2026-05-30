import { type IProductResponse } from "@ecommerce/shared";
import { Button } from "@ecommerce/ui";
import { ChevronLeft, ChevronRight, Eye, Package, Star } from "lucide-react";

import {
  formatCurrency,
  getProductName,
  getProductStatus,
} from "./product.utils";

interface IProductsTableProps {
  products: IProductResponse[];
  error: string | null;
  page: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetail: (product: IProductResponse) => void;
}

export const ProductsTable = ({
  products,
  error,
  page,
  total,
  totalPages,
  onPageChange,
  onViewDetail,
}: IProductsTableProps) => (
  <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-xl backdrop-blur-xl">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border-color)] bg-white/1 text-xs font-bold tracking-wider text-[var(--muted)] uppercase">
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">Slug</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Rating</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {error ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-red-400">
                {error}
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-12 text-center text-[var(--muted)]"
              >
                No products found.
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const name = getProductName(product.translations, product.slug);
              const statusInfo = getProductStatus(product.status);

              return (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-white/1"
                >
                  {/* Thumbnail + Name */}
                  <td className="px-6 py-4">
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
                  </td>

                  <td className="px-6 py-4">
                    <code className="text-xs text-[var(--muted)]">
                      {product.slug}
                    </code>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-semibold ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-semibold text-[var(--app-text)]">
                    {formatCurrency(product.base_price)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-[var(--app-text)]">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      onClick={() => onViewDetail(product)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors hover:bg-indigo-500 hover:text-white"
                      aria-label={`View product ${name}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="flex items-center justify-between border-t border-[var(--border-color)] px-6 py-4">
        <span className="text-xs text-[var(--muted)]">
          Page <span className="font-bold text-[var(--app-text)]">{page}</span>{" "}
          of{" "}
          <span className="font-bold text-[var(--app-text)]">{totalPages}</span>{" "}
          (<span className="font-bold text-[var(--app-text)]">{total}</span>{" "}
          products)
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            disabled={page === 1}
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            disabled={page === totalPages}
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )}
  </div>
);

ProductsTable.displayName = "ProductsTable";
