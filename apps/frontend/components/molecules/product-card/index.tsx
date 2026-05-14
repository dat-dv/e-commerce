"use client";

import React from "react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { motion } from "framer-motion";
import { Eye, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";
import { useCartStore } from "@/hooks/cart/use-cart-store";
import Image from "next/image";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CALLBACK_URL_KEY } from "@/constants/routes";

import { TProduct } from "@/domain/products/types/products.model";

interface ProductCardProps {
  product: TProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((s) => s.addItem);
  const sku = product?.skus?.[0];

  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info("Please sign in to add items to cart");
      const productDetailUrl = APP_ROUTES.PRODUCT_DETAIL(product.slug);
      const callbackUrl = encodeURIComponent(productDetailUrl);
      router.push(`${APP_ROUTES.SIGN_IN}?${CALLBACK_URL_KEY}=${callbackUrl}`);
      return;
    }

    const priceNumber = sku.price;

    addItem(
      {
        id: sku?.id || `sku-${product.id}`,
        product_id: String(product.id),
        sku_id: sku?.id || `sku-${product.id}`,
        name: product.name,
        price: priceNumber,
        image_url: product.image_url || sku?.image_url || "",
        attributes: product.category,
      },
      1,
    );
    toast.success("Added to cart");
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
        {sku?.discount_percent && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10 shadow-lg shadow-red-500/20">
            -{sku.discount_percent}%
          </div>
        )}

        {/* Nút Xem nhanh / Thêm vào giỏ khi Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            href={APP_ROUTES.PRODUCT_DETAIL(product.slug)}
            className="p-3 bg-white text-black rounded-full hover:bg-white/90 transition-colors transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center"
            title="View Details"
          >
            <Eye size={20} />
          </Link>
          <button
            onClick={handleAddToCart}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75 flex items-center justify-center"
            title="Add to Cart"
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
          <Link href={APP_ROUTES.PRODUCT_DETAIL(product.slug)}>
            {product.name}
          </Link>
        </h3>
        {/* Phần giá sản phẩm */}
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex flex-col">
            <span className="text-sm font-black text-blue-500">
              {formatCurrency(sku?.price)}
            </span>
            {sku?.original_price && (
              <span className="text-xs text-content/30 line-through mt-0.5">
                {formatCurrency(sku.original_price)}
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
