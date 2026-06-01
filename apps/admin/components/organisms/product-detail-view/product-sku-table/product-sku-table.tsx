import {
  type IAttributeListResponse,
  type IProductResponse,
  type IUpdateProductSkuRequest,
} from "@ecommerce/shared";
import { Button } from "@ecommerce/ui";
import { ImageIcon, Layers, Plus, Trash2 } from "lucide-react";

import type { IProductFormState } from "@/hooks/product/use-product-detail-form";

import { formatCurrency } from "../products-view/product.utils";

interface IProductSkuTableProps {
  product: IProductResponse;
  attributes?: IAttributeListResponse;
  isEditing?: boolean;
  formState?: IProductFormState | null;
  updateFormState?: <K extends keyof IProductFormState>(
    key: K,
    value: IProductFormState[K],
  ) => void;
}

export const ProductSkuTable = ({
  product,
  attributes: attributeOptions = [],
  isEditing = false,
  formState,
  updateFormState,
}: IProductSkuTableProps) => {
  const editSkus = formState?.skus ?? [];
  const rows = isEditing ? editSkus : (product.skus ?? []);
  const skuCodes = editSkus.map((sku) => sku.sku_code.trim()).filter(Boolean);

  const getSkuCodeError = (sku: IUpdateProductSkuRequest) => {
    const skuCode = sku.sku_code.trim();

    if (!skuCode) return "Required";
    if (skuCodes.filter((code) => code === skuCode).length > 1) {
      return "Duplicate";
    }

    return null;
  };

  const getSkuPriceError = (sku: IUpdateProductSkuRequest) =>
    Number(sku.price) < 0 ? "Invalid" : null;

  const getSkuOriginalPriceError = (sku: IUpdateProductSkuRequest) =>
    sku.original_price !== null &&
    sku.original_price !== undefined &&
    Number(sku.original_price) < 0
      ? "Invalid"
      : null;

  const getSkuStockError = (sku: IUpdateProductSkuRequest) =>
    Number(sku.stock) < 0 || !Number.isInteger(Number(sku.stock))
      ? "Invalid"
      : null;

  const getSkuAttributes = (skuId?: string) => {
    const sku = product.skus?.find((item) => item.id === skuId);

    return (
      sku?.sku_attribute_values
        ?.map((item) => {
          const attribute = item.attribute_value?.attribute?.name;
          const value = item.attribute_value?.value;

          return attribute && value ? `${attribute}: ${value}` : value;
        })
        .filter(Boolean) ?? []
    );
  };

  const handleSkuPriceChange = (index: number, newPrice: number) => {
    if (!updateFormState || !formState) return;
    updateFormState(
      "skus",
      formState.skus.map((sku, skuIndex) =>
        skuIndex === index ? { ...sku, price: newPrice } : sku,
      ),
    );
  };

  const handleSkuCodeChange = (index: number, newCode: string) => {
    if (!updateFormState || !formState) return;
    updateFormState(
      "skus",
      formState.skus.map((sku, skuIndex) =>
        skuIndex === index ? { ...sku, sku_code: newCode } : sku,
      ),
    );
  };

  const handleSkuStockChange = (index: number, newStock: number) => {
    if (!updateFormState || !formState) return;
    updateFormState(
      "skus",
      formState.skus.map((sku, skuIndex) =>
        skuIndex === index ? { ...sku, stock: newStock } : sku,
      ),
    );
  };

  const handleSkuOriginalPriceChange = (
    index: number,
    newOriginalPrice: number | null,
  ) => {
    if (!updateFormState || !formState) return;
    updateFormState(
      "skus",
      formState.skus.map((sku, skuIndex) =>
        skuIndex === index ? { ...sku, original_price: newOriginalPrice } : sku,
      ),
    );
  };

  const handleSkuUnitPriceChange = (index: number, newUnitPrice: string) => {
    if (!updateFormState || !formState) return;
    updateFormState(
      "skus",
      formState.skus.map((sku, skuIndex) =>
        skuIndex === index ? { ...sku, unit_price: newUnitPrice } : sku,
      ),
    );
  };

  const handleSkuImageUrlChange = (index: number, newImageUrl: string) => {
    if (!updateFormState || !formState) return;
    updateFormState(
      "skus",
      formState.skus.map((sku, skuIndex) =>
        skuIndex === index ? { ...sku, image_url: newImageUrl } : sku,
      ),
    );
  };

  const handleSkuAttributeValueToggle = (
    index: number,
    attributeValueId: string,
  ) => {
    if (!updateFormState || !formState) return;
    updateFormState(
      "skus",
      formState.skus.map((sku, skuIndex) => {
        if (skuIndex !== index) return sku;

        const currentIds = sku.attribute_value_ids ?? [];
        return {
          ...sku,
          attribute_value_ids: currentIds.includes(attributeValueId)
            ? currentIds.filter((id) => id !== attributeValueId)
            : [...currentIds, attributeValueId],
        };
      }),
    );
  };

  const handleAddSku = () => {
    if (!updateFormState || !formState) return;
    updateFormState("skus", [
      ...formState.skus,
      {
        sku_code: "",
        price: product.base_price,
        stock: 0,
        original_price: null,
        image_url: "",
        unit_price: "VND",
      },
    ]);
  };

  const handleRemoveSku = (index: number) => {
    if (!updateFormState || !formState) return;

    const sku = formState.skus[index];
    if (!sku) return;

    if (formState.skus.length === 1) {
      return;
    }

    if (sku.id) {
      updateFormState("deleted_sku_ids", [
        ...new Set([...formState.deleted_sku_ids, sku.id]),
      ]);
    }

    updateFormState(
      "skus",
      formState.skus.filter((_, skuIndex) => skuIndex !== index),
    );
  };

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

  return (
    <div className="border-content/5 mt-6 border-t pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-[var(--app-text)] uppercase">
          <Layers className="text-primary h-4 w-4" />
          Product SKUs ({rows.length})
        </h3>

        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSku}
            className="border-primary/20 text-primary hover:bg-primary/5 rounded-lg"
          >
            <Plus className="h-4 w-4" />
            Add SKU
          </Button>
        )}
      </div>

      {rows.length > 0 ? (
        <div className="border-content/5 overflow-hidden rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-content/[0.02] border-content/5 border-b text-xs font-semibold tracking-wider text-[var(--muted)] uppercase">
              <tr>
                <th className="px-4 py-3">SKU Code</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Original</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3">Media</th>
                {isEditing && <th className="px-4 py-3 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-content/5 divide-y">
              {rows.map((sku, index) => {
                const editSku = sku as IUpdateProductSkuRequest;
                const attributes = getSkuAttributes(sku.id);
                const skuCodeError = isEditing
                  ? getSkuCodeError(editSku)
                  : null;
                const skuPriceError = isEditing
                  ? getSkuPriceError(editSku)
                  : null;
                const skuOriginalPriceError = isEditing
                  ? getSkuOriginalPriceError(editSku)
                  : null;
                const skuStockError = isEditing
                  ? getSkuStockError(editSku)
                  : null;

                return (
                  <tr
                    key={sku.id ?? `new-sku-${index}`}
                    className="hover:bg-content/[0.01] transition-colors"
                  >
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={editSku.sku_code}
                            onChange={(e) =>
                              handleSkuCodeChange(index, e.target.value)
                            }
                            className={`w-40 rounded-md border bg-[var(--card-bg)] px-2 py-1 text-sm font-semibold text-[var(--app-text)] focus:outline-none ${
                              skuCodeError
                                ? "border-red-400 focus:border-red-400"
                                : "focus:border-primary border-[var(--border-color)]"
                            }`}
                          />
                          {skuCodeError && (
                            <p className="text-xs font-semibold text-red-300">
                              {skuCodeError}
                            </p>
                          )}
                          {attributes.length > 0 && (
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
                          )}
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
                                        editSku.attribute_value_ids?.includes(
                                          value.id,
                                        ) ?? false;

                                      return (
                                        <button
                                          key={value.id}
                                          type="button"
                                          onClick={() =>
                                            handleSkuAttributeValueToggle(
                                              index,
                                              value.id,
                                            )
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
                      ) : (
                        <div className="space-y-1">
                          <code className="text-primary text-xs font-semibold">
                            {sku.sku_code}
                          </code>
                          {attributes.length > 0 && (
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
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <div className="ml-auto space-y-1">
                          <input
                            type="number"
                            value={editSku.price}
                            onChange={(e) =>
                              handleSkuPriceChange(
                                index,
                                Number(e.target.value),
                              )
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
                      ) : (
                        <span className="font-semibold text-[var(--app-text)]">
                          {formatCurrency(sku.price)}{" "}
                          <span className="text-xs text-[var(--muted)]">
                            {sku.unit_price ?? "VND"}
                          </span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <div className="ml-auto space-y-1">
                          <input
                            type="number"
                            value={editSku.original_price ?? ""}
                            onChange={(e) =>
                              handleSkuOriginalPriceChange(
                                index,
                                e.target.value ? Number(e.target.value) : null,
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
                      ) : sku.original_price ? (
                        <span className="text-sm font-semibold text-[var(--muted)] line-through">
                          {formatCurrency(sku.original_price)}
                        </span>
                      ) : (
                        <span className="text-sm text-[var(--muted)]">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <div className="ml-auto space-y-1">
                          <input
                            type="number"
                            value={editSku.stock}
                            onChange={(e) =>
                              handleSkuStockChange(
                                index,
                                Number(e.target.value),
                              )
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
                      ) : (
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ${getStockBadge(Number(sku.stock)).className}`}
                        >
                          {sku.stock > 0
                            ? `${sku.stock} items`
                            : "Out of stock"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editSku.unit_price ?? ""}
                            onChange={(e) =>
                              handleSkuUnitPriceChange(index, e.target.value)
                            }
                            className="focus:border-primary w-20 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1 text-sm font-semibold text-[var(--app-text)] focus:outline-none"
                            placeholder="Unit"
                          />
                          <input
                            type="url"
                            value={editSku.image_url ?? ""}
                            onChange={(e) =>
                              handleSkuImageUrlChange(index, e.target.value)
                            }
                            className="focus:border-primary w-44 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1 text-sm text-[var(--app-text)] focus:outline-none"
                            placeholder="Image URL"
                          />
                        </div>
                      ) : sku.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={sku.image_url}
                          alt={sku.sku_code}
                          className="h-10 w-10 rounded-md border border-[var(--border-color)] object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border-color)] text-[var(--muted)]">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                      )}
                    </td>
                    {isEditing && (
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSku(index)}
                          disabled={editSkus.length === 1}
                          className="ml-auto h-8 w-8 rounded-lg text-red-300 hover:bg-red-500/10 disabled:opacity-30"
                          aria-label={`Remove SKU ${editSku.sku_code || index + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-4 text-center text-sm text-[var(--muted)]">
          No SKUs registered for this product.
        </p>
      )}
    </div>
  );
};

ProductSkuTable.displayName = "ProductSkuTable";
