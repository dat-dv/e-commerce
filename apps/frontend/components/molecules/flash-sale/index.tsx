"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

interface FlashSaleProduct {
  id: number;
  name: string;
  price: string;
  oldPrice: string;
  sold: number;
  total: number;
}

interface FlashSaleProps {
  products: FlashSaleProduct[];
}

export const FlashSale = ({ products }: FlashSaleProps) => {
  return (
    <div className="bg-surface border border-content/[0.05] rounded-3xl p-6 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-content flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            Flash Sale
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              01
            </span>
            <span className="text-content font-bold">:</span>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              23
            </span>
            <span className="text-content font-bold">:</span>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              45
            </span>
          </div>
        </div>
        <Link
          href="#"
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group flex flex-col gap-3">
            <div className="relative aspect-square bg-content/[0.02] border border-content/[0.05] rounded-xl overflow-hidden flex items-center justify-center">
              <span className="text-content/20 text-xs font-medium">
                Product Image
              </span>
              <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                -
                {Math.round(
                  (1 -
                    parseFloat(product.price.slice(1)) /
                      parseFloat(product.oldPrice.slice(1))) *
                    100,
                )}
                %
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-content group-hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-red-500">
                  {product.price}
                </span>
                <span className="text-xs text-content/40 line-through">
                  {product.oldPrice}
                </span>
              </div>
              <div className="mt-1">
                <div className="w-full h-1.5 bg-content/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${(product.sold / product.total) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] font-bold text-content/60">
                    Sold {product.sold}
                  </span>
                  <span className="text-[10px] font-bold text-content/40">
                    {product.total} left
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
