"use client";

import { useRouter } from "next/navigation";

import { APP_ROUTES } from "@/constants/routes";
import { useProductDetailData } from "@/hooks/product/use-product-detail-data";
import { useProductDetailForm } from "@/hooks/product/use-product-detail-form";
import { useProductMetadata } from "@/hooks/product/use-product-metadata";

import { ProductDetailHeader } from "./product-detail-header";
import { ProductGeneralInfo } from "./product-general-info";
import { ProductTranslations } from "./product-translations";

export const ProductDetailView = () => {
  const router = useRouter();

  const { product, loading, error, setProduct } = useProductDetailData();

  const {
    brands,
    attributes,
    languages,
    categoryTree,
    metadataLoading,
    metadataError,
  } = useProductMetadata(!!product); // only load if we have a product

  const {
    isEditing,
    isDirty,
    isSaving,
    isUploadingThumbnail,
    canSave,
    editPrice,
    setEditPrice,
    editStatus,
    setEditStatus,
    editThumbnailUrl,
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
    uploadThumbnail,
    saveProduct,
  } = useProductDetailForm(product, setProduct, categoryTree, metadataLoading);

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
            attributes={attributes}
            categoryTree={categoryTree}
            metadataLoading={metadataLoading}
            metadataError={metadataError}
            isEditing={isEditing}
            editPrice={editPrice}
            setEditPrice={setEditPrice}
            editStatus={editStatus}
            setEditStatus={setEditStatus}
            editThumbnailUrl={editThumbnailUrl}
            isUploadingThumbnail={isUploadingThumbnail}
            onThumbnailUpload={uploadThumbnail}
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
            languages={languages}
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
