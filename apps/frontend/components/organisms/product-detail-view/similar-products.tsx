"use client";

import { TProduct } from "@/domain/products/types/products.model";
import { ProductCard } from "../../molecules/product-card";

import Button from "@/components/atoms/button";
import { useTranslations } from "next-intl";

interface SimilarProductsProps {
  similarProducts: TProduct[];
  loadingSimilar: boolean;
}

export const SimilarProducts = ({
  similarProducts,
  loadingSimilar,
}: SimilarProductsProps) => {
  const t = useTranslations("ProductDetailPage");
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-content">
          {t("similarProducts")}
        </h2>
        <Button
          variant="ghost"
          className="text-sm font-semibold text-primary hover:underline hover:bg-transparent h-auto px-0 active:scale-100"
        >
          {t("viewAll")}
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loadingSimilar ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-content/[0.05] rounded-xl p-3 h-64"
            ></div>
          ))
        ) : similarProducts.length === 0 ? (
          <div className="col-span-full text-center text-content/50 py-8">
            {t("noSimilarProducts")}
          </div>
        ) : (
          similarProducts.map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </div>
    </div>
  );
};
