import {
  type IProductResponse,
  type IUpdateProductSkuRequest,
} from "@ecommerce/shared";
import { Layers } from "lucide-react";

import { formatCurrency } from "../products-view/product.utils";

interface IProductSkuTableProps {
  product: IProductResponse;
  isEditing?: boolean;
  editSkus?: IUpdateProductSkuRequest[];
  setEditSkus?: (skus: IUpdateProductSkuRequest[]) => void;
}

export const ProductSkuTable = ({
  product,
  isEditing = false,
  editSkus = [],
  setEditSkus,
}: IProductSkuTableProps) => {
  const handleSkuPriceChange = (skuId: string, newPrice: number) => {
    if (!setEditSkus) return;
    setEditSkus(
      editSkus.map((sku) =>
        sku.id === skuId ? { ...sku, price: newPrice } : sku,
      ),
    );
  };

  const handleSkuStockChange = (skuId: string, newStock: number) => {
    if (!setEditSkus) return;
    setEditSkus(
      editSkus.map((sku) =>
        sku.id === skuId ? { ...sku, stock: newStock } : sku,
      ),
    );
  };

  return (
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
              {product.skus.map((sku) => {
                const editSku = editSkus.find((s) => s.id === sku.id) || sku;
                return (
                  <tr
                    key={sku.id}
                    className="hover:bg-content/[0.01] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <code className="text-xs font-semibold text-indigo-300">
                        {sku.sku_code}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editSku.price}
                          onChange={(e) =>
                            handleSkuPriceChange(sku.id, Number(e.target.value))
                          }
                          className="w-28 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1 text-right text-sm font-semibold text-[var(--app-text)] focus:border-indigo-500 focus:outline-none"
                        />
                      ) : (
                        <span className="font-semibold text-[var(--app-text)]">
                          {formatCurrency(sku.price)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editSku.stock}
                          onChange={(e) =>
                            handleSkuStockChange(sku.id, Number(e.target.value))
                          }
                          className="w-24 rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-1 text-right text-sm font-semibold text-[var(--app-text)] focus:border-indigo-500 focus:outline-none"
                        />
                      ) : (
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
                      )}
                    </td>
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
