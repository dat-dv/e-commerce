"use client";

import { APP_ROUTES } from "@/constants/routes";

import { ProductDetailHeader } from "./product-detail-header";
import { ProductGeneralInfo } from "./product-general-info";
import { ProductTranslations } from "./product-translations";
import { useProductDetailView } from "./use-product-detail-view";

export const ProductDetailView = () => {
  const {
    product,
    brands,
    categoryTree,
    loading,
    metadataLoading,
    error,
    metadataError,
    router,
    isEditing,
    isDirty,
    isSaving,
    canSave,
    editPrice,
    setEditPrice,
    editStatus,
    setEditStatus,
    editBrandId,
    setEditBrandId,
    editCategoryIds,
    setEditCategoryIds,
    editTranslations,
    setEditTranslations,
    editSkus,
    setEditSkus,
    deletedSkuIds,
    setDeletedSkuIds,
    startEdit,
    cancelEdit,
    saveProduct,
  } = useProductDetailView();

  const handleBack = () => {
    if (
      isEditing &&
      isDirty &&
      !window.confirm("Discard unsaved product changes?")
    ) {
      return;
    }

    router.push(APP_ROUTES.PRODUCTS);
  };

  return (
    <div className="space-y-6">
      <ProductDetailHeader
        product={product}
        onBack={handleBack}
        isEditing={isEditing}
        isDirty={isDirty}
        isSaving={isSaving}
        canSave={canSave}
        onEdit={startEdit}
        onCancel={cancelEdit}
        onSave={saveProduct}
      />

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-6">
          <div className="h-64 animate-pulse rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]" />
          <div className="h-48 animate-pulse rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]" />
        </div>
      )}

      {!loading && product && (
        <div className="space-y-6">
          <ProductGeneralInfo
            product={product}
            brands={brands}
            categoryTree={categoryTree}
            metadataLoading={metadataLoading}
            metadataError={metadataError}
            isEditing={isEditing}
            editPrice={editPrice}
            setEditPrice={setEditPrice}
            editStatus={editStatus}
            setEditStatus={setEditStatus}
            editBrandId={editBrandId}
            setEditBrandId={setEditBrandId}
            editCategoryIds={editCategoryIds}
            setEditCategoryIds={setEditCategoryIds}
            editSkus={editSkus}
            setEditSkus={setEditSkus}
            deletedSkuIds={deletedSkuIds}
            setDeletedSkuIds={setDeletedSkuIds}
          />
          <ProductTranslations
            product={product}
            isEditing={isEditing}
            editTranslations={editTranslations}
            setEditTranslations={setEditTranslations}
          />
        </div>
      )}
    </div>
  );
};

ProductDetailView.displayName = "ProductDetailView";
