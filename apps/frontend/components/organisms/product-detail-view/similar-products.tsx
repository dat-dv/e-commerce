"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { APP_ROUTES } from "@/constants/routes";
import { TProduct } from "@/domain/products/types/products.model";

interface SimilarProductsProps {
  similarProducts: TProduct[];
  loadingSimilar: boolean;
}

export const SimilarProducts = ({
  similarProducts,
  loadingSimilar,
}: SimilarProductsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-content">
          Sản phẩm cùng danh mục
        </h2>
        <button className="text-sm font-semibold text-primary hover:underline">
          Xem tất cả
        </button>
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
            Không có sản phẩm tương tự
          </div>
        ) : (
          similarProducts.map((p) => (
            <Link
              key={p.id}
              href={APP_ROUTES.PRODUCT_DETAIL(p.slug)}
              className="group cursor-pointer bg-surface border border-content/[0.05] rounded-xl p-3 shadow-sm hover:shadow-md transition-all block"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-content/[0.02] mb-3">
                <Image
                  src={
                    p.image_url ||
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format"
                  }
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-sm text-content line-clamp-1">
                {p.name}
              </h3>
              <p className="text-sm font-black text-primary mt-1">
                {Number(p.skus[0]?.price || 0).toLocaleString("vi-VN")} đ
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
