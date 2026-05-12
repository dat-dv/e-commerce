"use client";

import React from "react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { ArrowRight, Flame } from "lucide-react";
import { FlashSaleCard } from "../product-card/flash-sale-card";

interface FlashSaleProduct {
  id: string;
  name: string;
  price: string;
  oldPrice?: string;
  sold?: number;
  total?: number;
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
          href={APP_ROUTES.CATEGORY("flash-sale")}
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <FlashSaleCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
