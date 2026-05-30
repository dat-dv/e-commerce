"use client";

import { APP_ROUTES } from "@/constants/routes";

import { ProductDetailHeader } from "./product-detail-header";
import { ProductGeneralInfo } from "./product-general-info";
import { ProductTranslations } from "./product-translations";
import { useProductDetailView } from "./use-product-detail-view";

export const ProductDetailView = () => {
  const {
    product,
    loading,
    error,
    router,
    isEditing,
    isSaving,
    saveError,
    successMessage,
    editPrice,
    setEditPrice,
    editStatus,
    setEditStatus,
    editTranslations,
    setEditTranslations,
    editSkus,
    setEditSkus,
    startEdit,
    cancelEdit,
    saveProduct,
  } = useProductDetailView();

  const handleBack = () => {
    router.push(APP_ROUTES.PRODUCTS);
  };

  return (
    <div className="space-y-6">
      <ProductDetailHeader
        product={product}
        onBack={handleBack}
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={startEdit}
        onCancel={cancelEdit}
        onSave={saveProduct}
      />

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {saveError && (
        <div className="animate-fadeIn rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {saveError}
        </div>
      )}

      {successMessage && (
        <div className="animate-fadeIn rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {successMessage}
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
            isEditing={isEditing}
            editPrice={editPrice}
            setEditPrice={setEditPrice}
            editStatus={editStatus}
            setEditStatus={setEditStatus}
            editSkus={editSkus}
            setEditSkus={setEditSkus}
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
