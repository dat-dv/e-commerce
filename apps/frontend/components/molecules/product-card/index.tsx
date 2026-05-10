"use client";

import React from "react";
import Link from "next/link";

export interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
}

export const ProductCard = ({ product }: { product: Product }) => (
  <div className="flex flex-col gap-4">
    {/* Product Image Placeholder */}
    <div className="group relative aspect-square bg-content/[0.02] border border-content/[0.05] rounded-2xl overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-content/[0.03] to-transparent" />
      <span className="text-content/20 text-sm font-medium">Product Image</span>

      {/* View Detail Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-content/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
        <Link
          href={`/products/${product.id}`}
          className="text-surface text-xs font-bold bg-primary px-4 py-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary/90"
        >
          View Detail
        </Link>
      </div>
    </div>
    {/* Product Info */}
    <div className="flex flex-col gap-1">
      <span className="text-xs text-content/40 font-medium">
        {product.category}
      </span>
      <h3 className="text-sm font-bold text-content hover:text-primary transition-colors line-clamp-1">
        <Link href={`/products/${product.id}`}>{product.name}</Link>
      </h3>
      <span className="text-sm font-black text-content/80">
        {product.price}
      </span>
    </div>
  </div>
);
