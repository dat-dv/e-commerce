"use client";

import React from "react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { motion } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";
import { useCartStore } from "@/hooks/cart/use-cart-store";
import Image from "next/image";

export interface Product {
  id: string;
  name: string;
  price: string;
  original_price?: string;
  discount_percent?: number;
  category: string;
  image_url?: string;
}

export const ProductCard = ({ product }: { product: Product }) => {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const priceNumber = parseFloat(product.price.replace(/[^0-9.-]+/g, ""));
    addItem(
      {
        id: `sku-${product.id}`,
        product_id: String(product.id),
        sku_id: `sku-${product.id}`,
        name: product.name,
        price: isNaN(priceNumber) ? 0 : priceNumber,
        image_url: product.image_url || null,
        attributes: product.category,
      },
      1,
    );
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group bg-content/[0.02] border border-content/[0.05] rounded-2xl overflow-hidden flex flex-col gap-3 p-3 hover:border-content/[0.1] transition-colors shadow-lg shadow-black/5"
    >
      {/* Product Image Placeholder hoặc Real Image */}
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
          <span className="text-content/20 text-sm font-medium">
            Product Image
          </span>
        )}

        {/* Badge Giảm giá */}
        {product.discount_percent && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10 shadow-lg shadow-red-500/20">
            -{product.discount_percent}%
          </div>
        )}

        {/* Nút Xem nhanh / Thêm vào giỏ khi Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            href={APP_ROUTES.PRODUCT_DETAIL(product.id)}
            className="p-3 bg-white text-black rounded-full hover:bg-white/90 transition-colors transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center"
            title="Xem chi tiết"
          >
            <Eye size={20} />
          </Link>
          <button
            onClick={handleAddToCart}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75 flex items-center justify-center"
            title="Thêm vào giỏ"
          >
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1 px-1 py-1">
        <span className="text-xs text-content/40 font-medium uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="text-sm font-bold text-content hover:text-primary transition-colors line-clamp-1 mt-0.5">
          <Link href={APP_ROUTES.PRODUCT_DETAIL(product.id)}>
            {product.name}
          </Link>
        </h3>
        {/* Phần giá sản phẩm */}
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex flex-col">
            <span className="text-sm font-black text-blue-500">
              {product.price}
            </span>
            {product.original_price && (
              <span className="text-xs text-content/30 line-through mt-0.5">
                {product.original_price}
              </span>
            )}
          </div>
          {/* Icon giỏ hàng nhỏ cho mobile */}
          <button
            onClick={handleAddToCart}
            className="text-zinc-400 hover:text-blue-500 transition-colors lg:hidden"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
