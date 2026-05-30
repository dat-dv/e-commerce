"use client";

import {
  type IApiResponse,
  type IProductListResponse,
  type IProductResponse,
} from "@ecommerce/shared";
import {
  BasicLoading,
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  SearchInput,
} from "@ecommerce/ui";
import { ChevronLeft, ChevronRight, Eye, Package, Star } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { API_ROUTES } from "@/constants/routes";
import { apiClient } from "@/utils/request/api-client";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PRODUCT_STATUS_MAP: Record<number, { label: string; color: string }> = {
  0: { label: "Draft", color: "bg-zinc-500/10 text-zinc-400" },
  1: { label: "Active", color: "bg-emerald-500/10 text-emerald-400" },
  2: { label: "Out of Stock", color: "bg-red-500/10 text-red-400" },
};

const getProductStatus = (status: number) =>
  PRODUCT_STATUS_MAP[status] ?? {
    label: `Status ${status}`,
    color: "bg-zinc-500/10 text-zinc-400",
  };

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount,
  );

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * @description ProductsView organism renders the admin product listing, search, pagination, and detail modal.
 */
export const ProductsView = () => {
  const [products, setProducts] = useState<IProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedProduct, setSelectedProduct] =
    useState<IProductResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchProducts = useCallback(
    async (currentPage: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<
          IApiResponse<IProductListResponse>
        >(API_ROUTES.PRODUCTS.LIST, { params: { page: currentPage, limit } });
        setProducts(response.data?.items ?? []);
        setTotal(response.data?.meta?.total ?? 0);
        setTotalPages(response.data?.meta?.totalPages ?? 0);
      } catch (err: unknown) {
        console.error(err);
        setError("Failed to fetch product data. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [limit],
  );

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.slug.toLowerCase().includes(q) ||
        p.translations?.some((t) => t.name.toLowerCase().includes(q)),
    );
  }, [products, searchQuery]);

  return (
    <>
      {loading && <BasicLoading isBlur={false} />}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)] sm:text-3xl">
              Product Management
            </h1>
            <p className="mt-1.5 text-sm text-[var(--muted)]">
              Browse and inspect all products listed on the platform.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-2.5 shadow-sm backdrop-blur-xl">
            <Package className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-semibold text-[var(--app-text)]">
              {total} Total Products
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 shadow-xl backdrop-blur-xl">
          <SearchInput
            placeholder="Search by product name or slug..."
            value={searchQuery}
            onSearch={(q) => setSearchQuery(q)}
            onChange={(q) => setSearchQuery(q)}
            showSubmitButton={false}
            className="w-full"
          />
        </div>

        {/* Table */}
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
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-red-400"
                    >
                      {error}
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-[var(--muted)]"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const name =
                      product.translations?.find(() => true)?.name ??
                      product.slug;
                    const statusInfo = getProductStatus(product.status);

                    return (
                      <tr
                        key={product.id}
                        className="transition-colors hover:bg-white/1"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-white/5">
                              {product.thumbnail?.url ? (
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
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsDetailOpen(true);
                            }}
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
                Page{" "}
                <span className="font-bold text-[var(--app-text)]">{page}</span>{" "}
                of{" "}
                <span className="font-bold text-[var(--app-text)]">
                  {totalPages}
                </span>{" "}
                (
                <span className="font-bold text-[var(--app-text)]">
                  {total}
                </span>{" "}
                products)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Dialog */}
      <Dialog isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)}>
        <DialogPanel className="max-w-xl rounded-2xl border border-white/[0.08] bg-[#0c0d12]/95 p-6 shadow-2xl backdrop-blur-2xl">
          <DialogTitle className="text-xl font-bold text-[var(--app-text)]">
            Product Details
          </DialogTitle>

          {selectedProduct &&
            (() => {
              const name =
                selectedProduct.translations?.find(() => true)?.name ??
                selectedProduct.slug;
              const statusInfo = getProductStatus(selectedProduct.status);
              return (
                <div className="mt-6 space-y-5">
                  {/* Thumbnail + Name */}
                  <div className="flex items-center gap-4 rounded-xl border border-white/[0.04] bg-white/2 p-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-white/5">
                      {selectedProduct.thumbnail?.url ? (
                        <img
                          src={selectedProduct.thumbnail.url}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-[var(--muted)]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[var(--app-text)]">
                        {name}
                      </h4>
                      <code className="text-xs text-[var(--muted)]">
                        {selectedProduct.slug}
                      </code>
                      <div className="mt-1.5">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-white/[0.04] bg-white/2 px-3 py-3 text-center">
                      <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                        Price
                      </p>
                      <p className="mt-1 text-sm font-bold text-emerald-400">
                        {formatCurrency(selectedProduct.base_price)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.04] bg-white/2 px-3 py-3 text-center">
                      <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                        Rating
                      </p>
                      <div className="mt-1 flex items-center justify-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-[var(--app-text)]">
                          {selectedProduct.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/[0.04] bg-white/2 px-3 py-3 text-center">
                      <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                        Sold
                      </p>
                      <p className="mt-1 text-sm font-bold text-[var(--app-text)]">
                        {selectedProduct.sold_count}
                      </p>
                    </div>
                  </div>

                  {/* SKUs */}
                  {selectedProduct.skus && selectedProduct.skus.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                        SKUs ({selectedProduct.skus.length})
                      </p>
                      <div className="space-y-1.5 rounded-xl border border-white/[0.04] bg-white/2 p-3">
                        {selectedProduct.skus.map((sku) => (
                          <div
                            key={sku.id}
                            className="flex items-center justify-between gap-2"
                          >
                            <code className="text-xs text-indigo-300">
                              {sku.sku_code}
                            </code>
                            <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                              <span>
                                Stock:{" "}
                                <b className="text-[var(--app-text)]">
                                  {sku.stock}
                                </b>
                              </span>
                              <span className="font-semibold text-[var(--app-text)]">
                                {formatCurrency(sku.price)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reviews count */}
                  <div className="flex gap-3">
                    <div className="flex-1 rounded-xl border border-white/[0.04] bg-white/2 px-4 py-3">
                      <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                        Reviews
                      </p>
                      <p className="mt-1 text-base font-bold text-[var(--app-text)]">
                        {selectedProduct.review_count}
                      </p>
                    </div>
                    <div className="flex-1 rounded-xl border border-white/[0.04] bg-white/2 px-4 py-3">
                      <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                        Brand
                      </p>
                      <p className="mt-1 text-sm font-bold text-[var(--app-text)]">
                        {selectedProduct.brand?.slug ?? "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={() => setIsDetailOpen(false)}
                      className="rounded-lg bg-indigo-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-indigo-500/10 hover:bg-indigo-500"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              );
            })()}
        </DialogPanel>
      </Dialog>
    </>
  );
};

ProductsView.displayName = "ProductsView";
