import { Button, CommonTable } from "@ecommerce/ui";
import { Layers, Plus } from "lucide-react";

import type { IAdminAttribute, IAdminProduct } from "@/domain/product";
import type { IProductEditFormState } from "@/hooks/product/use-product-detail-form";

import {
  createProductSkuColumns,
  type EditSkuType,
  type SkuTableRow,
} from "./product-sku-columns";

interface IProductSkuTableProps {
  product: IAdminProduct;
  attributes?: IAdminAttribute[];
  isEditing?: boolean;
  formState?: IProductEditFormState | null;
  updateFormState?: <K extends keyof IProductEditFormState>(
    key: K,
    value: IProductEditFormState[K],
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
  const rows: SkuTableRow[] = isEditing ? editSkus : (product.skus ?? []);
  const skuCodes = editSkus.map((sku) => sku.skuCode.trim()).filter(Boolean);

  const getSkuCodeError = (sku: EditSkuType) => {
    const skuCode = sku.skuCode.trim();

    if (!skuCode) return "Required";
    if (skuCodes.filter((code) => code === skuCode).length > 1) {
      return "Duplicate";
    }

    return null;
  };

  const getSkuPriceError = (sku: EditSkuType) =>
    Number(sku.price) < 0 ? "Invalid" : null;

  const getSkuOriginalPriceError = (sku: EditSkuType) =>
    sku.originalPrice !== null &&
    sku.originalPrice !== undefined &&
    Number(sku.originalPrice) < 0
      ? "Invalid"
      : null;

  const getSkuStockError = (sku: EditSkuType) =>
    Number(sku.stock) < 0 || !Number.isInteger(Number(sku.stock))
      ? "Invalid"
      : null;

  const getSkuAttributes = (skuId?: string) => {
    const sku = product.skus?.find((item) => item.id === skuId);

    return (
      sku?.skuAttributeValues
        ?.map((item) => {
          const attribute = item.attributeValue?.attribute?.name;
          const value = item.attributeValue?.value;

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
        skuIndex === index ? { ...sku, skuCode: newCode } : sku,
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
        skuIndex === index ? { ...sku, originalPrice: newOriginalPrice } : sku,
      ),
    );
  };

  const handleSkuUnitPriceChange = (index: number, newUnitPrice: string) => {
    if (!updateFormState || !formState) return;
    updateFormState(
      "skus",
      formState.skus.map((sku, skuIndex) =>
        skuIndex === index ? { ...sku, unitPrice: newUnitPrice } : sku,
      ),
    );
  };

  const handleSkuImageUrlChange = (index: number, newImageUrl: string) => {
    if (!updateFormState || !formState) return;
    updateFormState(
      "skus",
      formState.skus.map((sku, skuIndex) =>
        skuIndex === index ? { ...sku, imageUrl: newImageUrl } : sku,
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

        const currentIds = sku.attributeValueIds ?? [];
        return {
          ...sku,
          attributeValueIds: currentIds.includes(attributeValueId)
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
        skuCode: "",
        price: product.basePrice,
        stock: 0,
        originalPrice: null,
        imageUrl: "",
        unitPrice: "VND",
        attributeValueIds: [],
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
      updateFormState("deletedSkuIds", [
        ...new Set([...formState.deletedSkuIds, sku.id]),
      ]);
    }

    updateFormState(
      "skus",
      formState.skus.filter((_, skuIndex) => skuIndex !== index),
    );
  };

  const columns = createProductSkuColumns({
    attributeOptions,
    editSkuCount: editSkus.length,
    isEditing,
    getSkuAttributes,
    getSkuCodeError,
    getSkuPriceError,
    getSkuOriginalPriceError,
    getSkuStockError,
    onSkuAttributeValueToggle: handleSkuAttributeValueToggle,
    onSkuCodeChange: handleSkuCodeChange,
    onSkuImageUrlChange: handleSkuImageUrlChange,
    onSkuOriginalPriceChange: handleSkuOriginalPriceChange,
    onSkuPriceChange: handleSkuPriceChange,
    onSkuStockChange: handleSkuStockChange,
    onSkuUnitPriceChange: handleSkuUnitPriceChange,
    onRemoveSku: handleRemoveSku,
  });

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

      <CommonTable
        name="admin-product-skus"
        data={rows}
        columns={columns}
        rowKey={(sku, index) => sku.id ?? `new-sku-${index}`}
        total={rows.length}
        page={1}
        pageSize={Math.max(rows.length, 1)}
        emptyState="No SKUs registered for this product."
        showFooter={false}
        showPageSizeSelect={false}
        className="border-content/5 overflow-hidden rounded-lg border"
      />
    </div>
  );
};

ProductSkuTable.displayName = "ProductSkuTable";
