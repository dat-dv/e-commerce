"use client";

import React from "react";
import { TProduct } from "@/domain/products/types/products.model";
import { ProductCard } from "../../molecules/product-card";

interface RecommendationsProps {
  recommendedProducts: TProduct[];
  loadingRecommended: boolean;
}

export const Recommendations = ({
  recommendedProducts,
  loadingRecommended,
}: RecommendationsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-content">Gợi ý cho bạn</h2>
        <button className="text-sm font-semibold text-primary hover:underline">
          Xem tất cả
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loadingRecommended ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-content/[0.05] rounded-xl p-3 h-64"
            ></div>
          ))
        ) : recommendedProducts.length === 0 ? (
          <div className="col-span-full text-center text-content/50 py-8">
            Không có gợi ý nào
          </div>
        ) : (
          recommendedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))
        )}
      </div>
    </div>
  );
};
