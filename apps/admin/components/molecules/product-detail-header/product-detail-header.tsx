import { Button } from "@ecommerce/ui";

import { PageHeader } from "@/components/molecules/page-header";
import { getProductStatus } from "@/components/organisms/products-view/product.utils";
import type { IAdminProduct } from "@/domain/product";

interface IProductDetailHeaderProps {
  product: IAdminProduct | null;
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
  const name = product?.translations?.[0]?.name ?? "";
  const statusInfo = product ? getProductStatus(product.status) : null;

  return (
    <PageHeader
      title="Product Detail"
      description={`Manage product translation names, descriptions, skus, and general properties.${isEditing && isDirty ? " Unsaved changes." : ""}`}
      backAction={onBack}
      backLabel="Back to products"
    >
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
                  className="bg-primary hover:bg-primary rounded-lg font-semibold text-white disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="border-primary/20 text-primary hover:bg-primary/5 rounded-lg"
              >
                Edit Product
              </Button>
            )}
          </div>
        </div>
      )}
    </PageHeader>
  );
};

ProductDetailHeader.displayName = "ProductDetailHeader";
