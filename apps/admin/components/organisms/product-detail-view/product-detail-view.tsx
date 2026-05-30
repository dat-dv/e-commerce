"use client";

import { APP_ROUTES } from "@/constants/routes";

import { ProductDetailHeader } from "./product-detail-header";
import { ProductInfoPanel } from "./product-info-panel";
import { useProductDetailView } from "./use-product-detail-view";

export const ProductDetailView = () => {
  const { product, error, router } = useProductDetailView();

  const handleBack = () => {
    router.push(APP_ROUTES.PRODUCTS);
  };

  return (
    <div className="space-y-6">
      <ProductDetailHeader product={product} onBack={handleBack} />

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {product && <ProductInfoPanel product={product} />}
    </div>
  );
};

ProductDetailView.displayName = "ProductDetailView";
