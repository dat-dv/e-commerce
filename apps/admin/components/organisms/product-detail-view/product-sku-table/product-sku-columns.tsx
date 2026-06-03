import { Button, type CommonTableColumn } from "@ecommerce/ui";
import { Trash2 } from "lucide-react";

import { AdminThumbnail } from "@/components/atoms/admin-thumbnail";
import { formatCurrency } from "@/components/organisms/products-view/product.utils";
import type { IAdminAttribute, IAdminProduct } from "@/domain/product";
import type { IProductEditFormState } from "@/hooks/product/use-product-detail-form";

export type EditSkuType = IProductEditFormState["skus"][number];
export type ViewSkuType = NonNullable<IAdminProduct["skus"]>[number];
export type SkuTableRow = EditSkuType | ViewSkuType;

interface ICreateProductSkuColumnsParams {
  attributeOptions: IAdminAttribute[];
  editSkuCount: number;
  isEditing: boolean;
  getSkuAttributes: (skuId?: string) => Array<string | undefined>;
  getSkuCodeError: (sku: EditSkuType) => string | null;
  getSkuPriceError: (sku: EditSkuType) => string | null;
  getSkuOriginalPriceError: (sku: EditSkuType) => string | null;
  getSkuStockError: (sku: EditSkuType) => string | null;
  onSkuAttributeValueToggle: (index: number, attributeValueId: string) => void;
  onSkuCodeChange: (index: number, value: string) => void;
  onSkuImageUrlChange: (index: number, value: string) => void;
  onSkuOriginalPriceChange: (index: number, value: number | null) => void;
  onSkuPriceChange: (index: number, value: number) => void;
  onSkuStockChange: (index: number, value: number) => void;
  onSkuUnitPriceChange: (index: number, value: string) => void;
  onRemoveSku: (index: number) => void;
}

const getStockBadge = (stock: number) => {
  if (stock <= 0) {
    return {
      label: "Out of stock",
      className: "bg-red-500/10 text-red-300",
    };
  }

  if (stock <= 10) {
    return {
      label: "Low stock",
      className: "bg-orange-500/10 text-orange-300",
    };
  }

  return {
    label: "In stock",
    className: "bg-emerald-500/10 text-emerald-300",
  };
};

const renderAttributeBadges = (attributes: Array<string | undefined>) =>
  attributes.length > 0 ? (
    <div className="flex flex-wrap gap-1">
      {attributes.map((attribute) => (
        <span
          key={attribute}
          className="bg-content/5 rounded px-1.5 py-0.5 text-[10px] font-semibold text-[var(--muted)]"
        >
          {attribute}
        </span>
      ))}
    </div>
  ) : null;

export const createProductSkuColumns = ({
  attributeOptions,
  editSkuCount,
  isEditing,
  getSkuAttributes,
  getSkuCodeError,
  getSkuPriceError,
  getSkuOriginalPriceError,
  getSkuStockError,
  onSkuAttributeValueToggle,
  onSkuCodeChange,
  onSkuImageUrlChange,
  onSkuOriginalPriceChange,
  onSkuPriceChange,
  onSkuStockChange,
  onSkuUnitPriceChange,
  onRemoveSku,
}: ICreateProductSkuColumnsParams): CommonTableColumn<SkuTableRow>[] => [
  {
    key: "skuCode",
    header: "SKU Code",
    width: 360,
    minWidth: 260,
    resizable: true,
    isRowHeader: true,
    className: "align-top",
    renderItem: ({ item, rowIndex }) => {
      const editSku = item as EditSkuType;
      const attributes = getSkuAttributes(item.id);
      const skuCodeError = isEditing ? getSkuCodeError(editSku) : null;

      if (!isEditing) {
        return (
          <div className="space-y-1">
            <code className="text-primary text-xs font-semibold">
              {item.skuCode}
            </code>
            {renderAttributeBadges(attributes)}
          </div>
        );
      }

      return (
        <div className="space-y-1">
          <input
            type="text"
            value={editSku.skuCode}
            onChange={(event) => onSkuCodeChange(rowIndex, event.target.value)}
            className={`w-40 rounded-md border bg-[var(--card-bg)] px-2 py-1 text-sm font-semibold text-[var(--app-text)] focus:outline-none ${
              skuCodeError
                ? "border-red-400 focus:border-red-400"
                : "focus:border-primary border-[var(--border-color)]"
            }`}
          />
          {skuCodeError && (
            <p className="text-xs font-semibold text-red-300">{skuCodeError}</p>
          )}
          {renderAttributeBadges(attributes)}
          {attributeOptions.length > 0 && (
            <div className="mt-2 grid max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
              {attributeOptions.map((attribute) => (
                <div
                  key={attribute.id}
                  className="bg-content/[0.02] rounded-md border border-[var(--border-color)] p-2"
                >
                  <p className="mb-1 text-[10px] font-bold tracking-wide text-[var(--muted)] uppercase">
                    {attribute.name}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {attribute.values?.map((value) => {
                      const checked =
                        editSku.attributeValueIds?.includes(value.id) ?? false;

                      return (
                        <button
                          key={value.id}
                          type="button"
                          onClick={() =>
                            onSkuAttributeValueToggle(rowIndex, value.id)
                          }
                          className={`rounded px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                            checked
                              ? "bg-primary/20 text-primary"
                              : "bg-content/5 hover:bg-content/10 text-[var(--muted)]"
                          }`}
                        >
                          {value.value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    },
  },
  {
    key: "price",
    header: "Price",
    width: 160,
    minWidth: 140,
    resizable: true,
    className: "text-right align-top",
    headerClassName: "justify-end text-right",
    renderItem: ({ item, rowIndex }) => {
      const editSku = item as EditSkuType;
      const skuPriceError = isEditing ? getSkuPriceError(editSku) : null;

      if (!isEditing) {
        return (
          <span className="font-semibold text-[var(--app-text)]">
            {formatCurrency(item.price)}{" "}
            <span className="text-xs text-[var(--muted)]">
              {item.unitPrice ?? "VND"}
            </span>
          </span>
        );
      }

      return (
        <div className="ml-auto space-y-1">
          <input
            type="number"
            value={editSku.price}
            onChange={(event) =>
              onSkuPriceChange(rowIndex, Number(event.target.value))
            }
            className={`w-28 rounded-md border bg-[var(--card-bg)] px-2 py-1 text-right text-sm font-semibold text-[var(--app-text)] focus:outline-none ${
              skuPriceError
                ? "border-red-400 focus:border-red-400"
                : "focus:border-primary border-[var(--border-color)]"
            }`}
          />
          {skuPriceError && (
            <p className="text-xs font-semibold text-red-300">
              {skuPriceError}
            </p>
          )}
        </div>
      );
    },
  },
  {
    key: "originalPrice",
    header: "Original",
    width: 160,
    minWidth: 140,
    resizable: true,
    className: "text-right align-top",
    headerClassName: "justify-end text-right",
    renderItem: ({ item, rowIndex }) => {
      const editSku = item as EditSkuType;
      const skuOriginalPriceError = isEditing
        ? getSkuOriginalPriceError(editSku)
        : null;

      if (!isEditing) {
        return item.originalPrice ? (
          <span className="text-sm font-semibold text-[var(--muted)] line-through">
            {formatCurrency(item.originalPrice)}
          </span>
        ) : (
          <span className="text-sm text-[var(--muted)]">-</span>
        );
      }

      return (
        <div className="ml-auto space-y-1">
          <input
            type="number"
            value={editSku.originalPrice ?? ""}
            onChange={(event) =>
              onSkuOriginalPriceChange(
                rowIndex,
                event.target.value ? Number(event.target.value) : null,
              )
            }
            className={`w-28 rounded-md border bg-[var(--card-bg)] px-2 py-1 text-right text-sm font-semibold text-[var(--app-text)] focus:outline-none ${
              skuOriginalPriceError
                ? "border-red-400 focus:border-red-400"
                : "focus:border-primary border-[var(--border-color)]"
            }`}
            placeholder="Optional"
          />
          {skuOriginalPriceError && (
            <p className="text-xs font-semibold text-red-300">
              {skuOriginalPriceError}
            </p>
          )}
        </div>
      );
    },
  },
  {
    key: "stock",
    header: "Stock",
    width: 140,
    minWidth: 120,
    resizable: true,
    className: "text-right align-top",
    headerClassName: "justify-end text-right",
    renderItem: ({ item, rowIndex }) => {
      const editSku = item as EditSkuType;
      const skuStockError = isEditing ? getSkuStockError(editSku) : null;

      if (!isEditing) {
        return (
          <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ${getStockBadge(Number(item.stock)).className}`}
          >
            {item.stock > 0 ? `${item.stock} items` : "Out of stock"}
          </span>
        );
      }

      return (
        <div className="ml-auto space-y-1">
          <input
            type="number"
            value={editSku.stock}
            onChange={(event) =>
              onSkuStockChange(rowIndex, Number(event.target.value))
            }
            className={`w-24 rounded-md border bg-[var(--card-bg)] px-2 py-1 text-right text-sm font-semibold text-[var(--app-text)] focus:outline-none ${
              skuStockError
                ? "border-red-400 focus:border-red-400"
                : "focus:border-primary border-[var(--border-color)]"
            }`}
          />
          {skuStockError && (
            <p className="text-xs font-semibold text-red-300">
              {skuStockError}
            </p>
          )}
        </div>
      );
    },
  },
  {
    key: "imageUrl",
    header: "Media",
    width: 220,
    minWidth: 180,
    resizable: true,
    className: "align-top",
    renderItem: ({ item, rowIndex }) => {
      const editSku = item as EditSkuType;

      if (!isEditing) {
        return (
          <AdminThumbnail
            src={item.imageUrl}
            alt={item.skuCode}
            containerClassName="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[var(--border-color)] text-[var(--muted)] bg-transparent"
          />
        );
      }

      return (
        <div className="space-y-2">
          <input
            type="text"
            value={editSku.unitPrice ?? ""}
            onChange={(event) =>
              onSkuUnitPriceChange(rowIndex, event.target.value)
            }
            className="focus:border-primary w-20 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1 text-sm font-semibold text-[var(--app-text)] focus:outline-none"
            placeholder="Unit"
          />
          <input
            type="url"
            value={editSku.imageUrl ?? ""}
            onChange={(event) =>
              onSkuImageUrlChange(rowIndex, event.target.value)
            }
            className="focus:border-primary w-44 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1 text-sm text-[var(--app-text)] focus:outline-none"
            placeholder="Image URL"
          />
        </div>
      );
    },
  },
  ...(isEditing
    ? [
        {
          key: "action",
          header: "Action",
          width: 96,
          minWidth: 88,
          className: "text-right align-top",
          headerClassName: "justify-end text-right",
          renderItem: ({ item, rowIndex }) => {
            const editSku = item as EditSkuType;

            return (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveSku(rowIndex)}
                disabled={editSkuCount === 1}
                className="ml-auto h-8 w-8 rounded-lg text-red-300 hover:bg-red-500/10 disabled:opacity-30"
                aria-label={`Remove SKU ${editSku.skuCode || rowIndex + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            );
          },
        } satisfies CommonTableColumn<SkuTableRow>,
      ]
    : []),
];
