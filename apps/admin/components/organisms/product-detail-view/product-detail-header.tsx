import { type IProductResponse } from "@ecommerce/shared";
import { Button } from "@ecommerce/ui";
import { ArrowLeft } from "lucide-react";

import {
  getProductName,
  getProductStatus,
} from "../products-view/product.utils";

interface IProductDetailHeaderProps {
  product: IProductResponse | null;
  onBack: () => void;
  isEditing: boolean;
  isDirty: boolean;
  isSaving: boolean;
  canSave: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export const ProductDetailHeader = ({
  product,
  onBack,
  isEditing,
  isDirty,
  isSaving,
  canSave,
  onEdit,
  onCancel,
  onSave,
}: IProductDetailHeaderProps) => {
  const name = product
    ? getProductName(product.translations, product.slug)
    : "";
  const statusInfo = product ? getProductStatus(product.status) : null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-content/5 rounded-lg text-[var(--app-text)]"
          aria-label="Back to products"
          disabled={isSaving}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)] sm:text-3xl">
            Product Detail
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage product translation names, descriptions, skus, and general
            properties.
            {isEditing && isDirty ? " Unsaved changes." : ""}
          </p>
        </div>
      </div>

      {product && (
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-2.5 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-[var(--app-text)]">
                {name || "Loading..."}
              </p>
              <p className="text-xs text-[var(--muted)]">{product.slug}</p>
            </div>
            {statusInfo && (
              <span
                className={`rounded-md px-2.5 py-0.5 text-[10px] font-semibold ${statusInfo.color}`}
              >
                {statusInfo.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  disabled={isSaving}
                  className="hover:bg-content/5 rounded-lg border-[var(--border-color)] text-[var(--app-text)]"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onSave}
                  disabled={!canSave}
                  className="rounded-lg bg-indigo-600 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="rounded-lg border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/5"
              >
                Edit Product
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

ProductDetailHeader.displayName = "ProductDetailHeader";
