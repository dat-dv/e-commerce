import {
  type IProductResponse,
  type IUpdateProductSkuRequest,
} from "@ecommerce/shared";
import { Button } from "@ecommerce/ui";
import { Layers, Plus, Trash2 } from "lucide-react";

import { formatCurrency } from "../products-view/product.utils";

interface IProductSkuTableProps {
  product: IProductResponse;
  isEditing?: boolean;
  editSkus?: IUpdateProductSkuRequest[];
  setEditSkus?: (skus: IUpdateProductSkuRequest[]) => void;
  deletedSkuIds?: string[];
  setDeletedSkuIds?: (skuIds: string[]) => void;
}

export const ProductSkuTable = ({
  product,
  isEditing = false,
  editSkus = [],
  setEditSkus,
  deletedSkuIds = [],
  setDeletedSkuIds,
}: IProductSkuTableProps) => {
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
    if (!setEditSkus) return;
    setEditSkus(
      editSkus.map((sku, skuIndex) =>
        skuIndex === index ? { ...sku, price: newPrice } : sku,
      ),
    );
  };

  const handleSkuCodeChange = (index: number, newCode: string) => {
    if (!setEditSkus) return;
    setEditSkus(
      editSkus.map((sku, skuIndex) =>
        skuIndex === index ? { ...sku, sku_code: newCode } : sku,
      ),
    );
  };

  const handleSkuStockChange = (index: number, newStock: number) => {
    if (!setEditSkus) return;
    setEditSkus(
      editSkus.map((sku, skuIndex) =>
        skuIndex === index ? { ...sku, stock: newStock } : sku,
      ),
    );
  };

  const handleAddSku = () => {
    if (!setEditSkus) return;
    setEditSkus([
      ...editSkus,
      {
        sku_code: "",
        price: product.base_price,
        stock: 0,
      },
    ]);
  };

  const handleRemoveSku = (index: number) => {
    if (!setEditSkus) return;

    const sku = editSkus[index];
    if (!sku) return;

    if (editSkus.length === 1) {
      return;
    }

    if (sku.id && setDeletedSkuIds) {
      setDeletedSkuIds([...new Set([...deletedSkuIds, sku.id])]);
    }

    setEditSkus(editSkus.filter((_, skuIndex) => skuIndex !== index));
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
          <Layers className="h-4 w-4 text-indigo-400" />
          Product SKUs ({rows.length})
        </h3>

        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSku}
            className="rounded-lg border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/5"
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
                <th className="px-4 py-3 text-right">Stock</th>
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
                                : "border-[var(--border-color)] focus:border-indigo-500"
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
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <code className="text-xs font-semibold text-indigo-300">
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
                                : "border-[var(--border-color)] focus:border-indigo-500"
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
                          {formatCurrency(sku.price)}
                        </span>
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
                                : "border-[var(--border-color)] focus:border-indigo-500"
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
