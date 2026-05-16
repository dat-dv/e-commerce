"use client";

import React from "react";
import Link from "next/link";
import { Eye, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";
import Image from "next/image";
import { APP_ROUTES } from "@/constants/routes";

import { TProduct } from "@/domain/products/types/products.model";

interface ProductCardProps {
  product: TProduct;
}

import { useAddToCart } from "@/hooks/cart/use-add-to-cart";

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useAddToCart();
  const sku = product?.skus?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const priceNumber = sku?.price || 0;

    addItem(
      {
        id: sku?.id || `sku-${product.id}`,
        productId: String(product.id),
        skuId: sku?.id || `sku-${product.id}`,
        name: product.name,
        price: priceNumber,
        originalPrice: sku?.originalPrice,
        discountPercent: sku?.discountPercent,
        imageUrl: product.imageUrl || sku?.imageUrl || "",
        attributes: product.category,
      },
      1,
    );
  };

  const badgeText =
    product.brand?.name ||
    (product.category !== "General" ? product.category : "");

  const hasDiscount = !!sku?.discountPercent;
  const discountLabel = `-${sku?.discountPercent}%`;

  const hasRating = product.rating !== undefined && product.rating > 0;
  const formattedRating = product.rating?.toFixed(1);

  const hasSoldCount = product.soldCount !== undefined && product.soldCount > 0;
  const formattedSoldCount =
    product.soldCount && product.soldCount > 1000
      ? `${(product.soldCount / 1000).toFixed(1)}k`
      : product.soldCount;

  const displayPrice = formatCurrency(sku?.price);
  const displayOriginalPrice = formatCurrency(sku?.originalPrice);

  return (
    <div className="group relative flex flex-col bg-content/[0.02] border border-content/[0.05] rounded-2xl p-3 transition-all duration-300 hover:border-content/[0.1] hover:shadow-xl hover:shadow-black/5">
      {/* Image Section */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-transparent flex items-center justify-center">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-contain transition-transform duration-500"
          />
        ) : (
          <div className="text-content/20 text-[10px] font-bold uppercase tracking-widest text-center">
            No Image
          </div>
        )}

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            href={APP_ROUTES.PRODUCT_DETAIL(product.slug)}
            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-white/90 transition-all"
          >
            <Eye size={18} />
          </Link>
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all"
          >
            <ShoppingBag size={18} />
          </button>
        </div>

        {/* Badges */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10 shadow-lg shadow-red-500/20">
            {discountLabel}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-3 flex flex-col flex-grow">
        {badgeText && (
          <span className="text-[10px] text-content/60 font-bold uppercase tracking-widest truncate">
            {badgeText}
          </span>
        )}

        <h3 className="mt-1 text-sm font-bold text-content line-clamp-1 group-hover:text-blue-500 transition-colors">
          <Link href={APP_ROUTES.PRODUCT_DETAIL(product.slug)}>
            {product.name}
          </Link>
        </h3>

        <div className="mt-1 flex items-center gap-2">
          {hasRating && (
            <div className="flex items-center gap-0.5 text-yellow-500 text-[10px] font-bold">
              <span>{formattedRating}</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          )}
          {hasSoldCount && (
            <span className="text-[10px] text-content/30">
              Đã bán {formattedSoldCount}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base font-black text-blue-500 tracking-tight">
              {displayPrice}
            </span>
            {sku?.originalPrice && (
              <span className="text-[10px] text-content/30 line-through">
                {displayOriginalPrice}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-8 h-8 rounded-full flex items-center justify-center text-content/20 hover:text-blue-500 hover:bg-blue-500/10 transition-all lg:hidden"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
