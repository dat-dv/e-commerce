import { type IProductResponse } from "@ecommerce/shared";
import {
  Award,
  Globe,
  Grid,
  Info,
  Layers,
  Package,
  Star,
  Tag,
} from "lucide-react";

import { formatCurrency, getProductName } from "../products-view/product.utils";

interface IProductInfoPanelProps {
  product: IProductResponse;
}

export const ProductInfoPanel = ({ product }: IProductInfoPanelProps) => {
  const defaultName = getProductName(product.translations, product.slug);

  return (
    <div className="space-y-6">
      {/* Overview Block */}
      <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-xl backdrop-blur-xl">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[var(--app-text)]">
            General Information
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Basic info and metrics of the product.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[200px_1fr]">
          {/* Thumbnail */}
          <div className="bg-content/[0.02] flex flex-col items-center justify-center rounded-xl border border-[var(--border-color)] p-4">
            <div className="bg-content/[0.02] flex h-36 w-36 items-center justify-center overflow-hidden rounded-xl border border-[var(--border-color)]">
              {product.thumbnail?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.thumbnail.url}
                  alt={defaultName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package className="h-16 w-16 text-[var(--muted)]" />
              )}
            </div>
            <p className="mt-2 text-xs font-semibold text-[var(--muted)]">
              Thumbnail Image
            </p>
          </div>

          {/* Core Info Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border-content/5 bg-content/[0.02] rounded-lg border p-4">
              <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
                <Tag className="h-4 w-4" />
                Base Price
              </div>
              <p className="text-lg font-extrabold text-emerald-400">
                {formatCurrency(product.base_price)}
              </p>
            </div>

            <div className="border-content/5 bg-content/[0.02] rounded-lg border p-4">
              <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
                <Award className="h-4 w-4" />
                Brand
              </div>
              <p className="text-sm font-semibold text-[var(--app-text)]">
                {product.brand?.slug ? (
                  <span className="capitalize">{product.brand.slug}</span>
                ) : (
                  <span className="text-[var(--muted)]">—</span>
                )}
              </p>
            </div>

            <div className="border-content/5 bg-content/[0.02] rounded-lg border p-4">
              <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
                <Grid className="h-4 w-4" />
                Categories
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {product.categories && product.categories.length > 0 ? (
                  product.categories.map((c) => {
                    const slugText = c.category?.slug || c.category_id;
                    return (
                      <span
                        key={c.category_id}
                        className="bg-content/5 rounded px-2 py-0.5 text-xs text-[var(--app-text)]"
                      >
                        {slugText}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-sm text-[var(--muted)]">—</span>
                )}
              </div>
            </div>

            <div className="border-content/5 bg-content/[0.02] rounded-lg border p-4">
              <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
                <Star className="h-4 w-4" />
                Performance Metrics
              </div>
              <div className="flex items-center gap-4 text-sm text-[var(--app-text)]">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <b>{product.rating.toFixed(1)}</b>
                </span>
                <span>
                  Sold: <b>{product.sold_count}</b>
                </span>
                <span>
                  Reviews: <b>{product.review_count}</b>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product SKUs Block */}
        <div className="border-content/5 mt-6 border-t pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-[var(--app-text)] uppercase">
              <Layers className="h-4 w-4 text-indigo-400" />
              Product SKUs ({product.skus?.length || 0})
            </h3>
          </div>

          {product.skus && product.skus.length > 0 ? (
            <div className="border-content/5 overflow-hidden rounded-lg border">
              <table className="w-full text-left text-sm">
                <thead className="bg-content/[0.02] border-content/5 border-b text-xs font-semibold tracking-wider text-[var(--muted)] uppercase">
                  <tr>
                    <th className="px-4 py-3">SKU Code</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-content/5 divide-y">
                  {product.skus.map((sku) => (
                    <tr
                      key={sku.id}
                      className="hover:bg-content/[0.01] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <code className="text-xs font-semibold text-indigo-300">
                          {sku.sku_code}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-[var(--app-text)]">
                        {formatCurrency(sku.price)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`font-semibold ${
                            sku.stock > 10
                              ? "text-[var(--app-text)]"
                              : sku.stock > 0
                                ? "text-orange-400"
                                : "font-bold text-red-400"
                          }`}
                        >
                          {sku.stock > 0
                            ? `${sku.stock} items`
                            : "Out of stock"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-[var(--muted)]">
              No SKUs registered for this product.
            </p>
          )}
        </div>
      </section>

      {/* Translations Section */}
      <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-xl backdrop-blur-xl">
        <div className="mb-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--app-text)]">
            <Globe className="h-5 w-5 text-indigo-400" />
            Product Translations & Content
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Locales and language-specific details.
          </p>
        </div>

        {product.translations && product.translations.length > 0 ? (
          <div className="space-y-4">
            {product.translations.map((t) => (
              <div
                key={t.id}
                className="border-content/5 bg-content/[0.02] rounded-lg border p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-300 uppercase">
                    {t.language_id}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <h5 className="text-xs font-bold text-[var(--muted)] uppercase">
                      Name
                    </h5>
                    <p className="mt-0.5 text-sm font-semibold text-[var(--app-text)]">
                      {t.name}
                    </p>
                  </div>
                  {t.description && (
                    <div>
                      <h5 className="text-xs font-bold text-[var(--muted)] uppercase">
                        Description
                      </h5>
                      <p className="mt-0.5 text-sm leading-relaxed whitespace-pre-line text-[var(--app-text)]">
                        {t.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-yellow-500/10 bg-yellow-500/5 p-4 text-sm text-yellow-300">
            <Info className="h-4 w-4 shrink-0" />
            No translations available for this product.
          </div>
        )}
      </section>
    </div>
  );
};

ProductInfoPanel.displayName = "ProductInfoPanel";
