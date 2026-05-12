"use client";

import React from "react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { motion } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";
import { useCartStore } from "@/hooks/cart/use-cart-store";
import Image from "next/image";

export interface FlashSaleProduct {
  id: number;
  name: string;
  price: string;
  oldPrice: string;
  sold: number;
  total: number;
  image_url?: string;
}

export const FlashSaleCard = ({ product }: { product: FlashSaleProduct }) => {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product detail

    const priceNumber = parseFloat(product.price.replace(/[^0-9.-]+/g, ""));

    addItem(
      {
        id: `sku-${product.id}`,
        product_id: String(product.id),
        sku_id: `sku-${product.id}`,
        name: product.name,
        price: isNaN(priceNumber) ? 0 : priceNumber,
        image_url: product.image_url || null,
        attributes: "Flash Sale",
      },
      1,
    );
  };

  // Calculate discount percentage
  const discountPercent = Math.round(
    (1 -
      parseFloat(product.price.replace(/[^0-9.-]+/g, "")) /
        parseFloat(product.oldPrice.replace(/[^0-9.-]+/g, ""))) *
      100,
  );

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group bg-content/[0.02] border border-content/[0.05] rounded-2xl overflow-hidden flex flex-col gap-3 p-3 hover:border-content/[0.1] transition-colors shadow-lg shadow-black/5"
    >
      {/* Image */}
      <div className="relative aspect-square bg-content/[0.02] border border-content/[0.05] rounded-xl overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-content/[0.03] to-transparent" />

        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-content/20 text-xs font-medium">
            Product Image
          </span>
        )}

        {/* Discount Badge */}
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10 shadow-lg shadow-red-500/20">
          -{discountPercent}%
        </div>

        {/* Action Buttons on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            href={APP_ROUTES.PRODUCT_DETAIL(product.id)}
            className="p-3 bg-white text-black rounded-full hover:bg-white/90 transition-colors transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center"
            title="View Details"
          >
            <Eye size={20} />
          </Link>
          <button
            onClick={handleAddToCart}
            className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75 flex items-center justify-center"
            title="Add to Cart"
          >
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 px-1 py-1">
        <h3 className="text-sm font-bold text-content hover:text-primary transition-colors line-clamp-1">
          <Link href={APP_ROUTES.PRODUCT_DETAIL(product.id)}>
            {product.name}
          </Link>
        </h3>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-black text-red-500">
            {product.price}
          </span>
          <span className="text-xs text-content/40 line-through">
            {product.oldPrice}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="w-full h-1.5 bg-content/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              style={{
                width: `${(product.sold / product.total) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[10px] font-bold text-content/60">
              Sold {product.sold}
            </span>
            <span className="text-[10px] font-bold text-content/40">
              Left {product.total - product.sold}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
