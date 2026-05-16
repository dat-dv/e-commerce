"use client";

import React from "react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { motion } from "framer-motion";
import { Eye, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";
import Image from "next/image";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CALLBACK_URL_KEY } from "@/constants/routes";
import { TFlashSaleProduct } from "@/domain/products/types/products.model";
import { useAddToCart } from "@/hooks/cart/use-add-to-cart";

export const FlashSaleCard = ({ product }: { product: TFlashSaleProduct }) => {
  const addItem = useAddToCart();
  const sku = product.skus[0];

  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product detail

    if (!user) {
      toast.info("Please sign in to add items to cart");
      const productDetailUrl = APP_ROUTES.PRODUCT_DETAIL(product.slug);
      const callbackUrl = encodeURIComponent(productDetailUrl);
      router.push(`${APP_ROUTES.SIGN_IN}?${CALLBACK_URL_KEY}=${callbackUrl}`);
      return;
    }

    const priceNumber = sku?.price || 0;

    addItem(
      {
        id: sku?.id || `sku-${product.id}`,
        productId: String(product.id),
        skuId: sku?.id || `sku-${product.id}`,
        name: product.name,
        price: isNaN(priceNumber) ? 0 : priceNumber,
        imageUrl: product.imageUrl || sku?.imageUrl || "",
        attributes: "Flash Sale",
      },
      1,
    );
    toast.success("Added to cart");
  };

  const currentPriceNum = sku?.price || 0;
  const oldPriceNum = sku?.originalPrice || 0;

  const discountPercent =
    oldPriceNum > 0 ? Math.round((1 - currentPriceNum / oldPriceNum) * 100) : 0;

  const soldCount = sku?.sold || 0;
  const totalCount = sku?.total || 1;
  const stockLeft = Math.max(0, totalCount - soldCount);
  const progressWidth = `${(soldCount / totalCount) * 100}%`;

  const displayPrice = formatCurrency(sku?.price);
  const displayOriginalPrice = formatCurrency(sku?.originalPrice);

  const hasOriginalPrice = !!sku?.originalPrice;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group bg-content/[0.02] border border-content/[0.05] rounded-2xl overflow-hidden flex flex-col gap-3 p-3 hover:border-content/[0.1] transition-colors shadow-lg shadow-black/5"
    >
      {/* Image */}
      <div className="relative aspect-square bg-content/[0.02] border border-content/[0.05] rounded-xl overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-content/[0.03] to-transparent" />

        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
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
            href={APP_ROUTES.PRODUCT_DETAIL(product.slug)}
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
          <Link href={APP_ROUTES.PRODUCT_DETAIL(product.slug)}>
            {product.name}
          </Link>
        </h3>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-black text-red-500">
            {displayPrice}
          </span>
          {hasOriginalPrice && (
            <span className="text-xs text-content/40 line-through">
              {displayOriginalPrice}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="w-full h-1.5 bg-content/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              style={{
                width: progressWidth,
              }}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[10px] font-bold text-content/60">
              Sold {soldCount}
            </span>
            <span className="text-[10px] font-bold text-content/40">
              Left {stockLeft}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
