"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { cn } from "@/utils/cn";
import { APP_ROUTES } from "@/constants/routes";
import { ICartItem } from "@/store/cart-store/cart-store.type";
import { Checkbox } from "./checkbox";
import { QuantitySelector } from "./quantity-selector";

interface CartItemRowProps {
  item: ICartItem;
  isSelected: boolean;
  onToggleSelect: () => void;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export const CartItemRow = ({
  item,
  isSelected,
  onToggleSelect,
  onRemove,
  onUpdateQuantity,
}: CartItemRowProps) => {
  // @ts-expect-error - is_out_of_stock exists in dummy items for demo
  const isOutOfStock = item.is_out_of_stock;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "bg-white/80 backdrop-blur-sm border rounded-2xl p-4 transition-all hover:shadow-md",
        isOutOfStock ? "opacity-60 grayscale-[0.5]" : "",
        isSelected
          ? "border-blue-500/50 bg-blue-50/20"
          : "border-content/[0.05]",
      )}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        {/* Checkbox & Product Info */}
        <div className="flex items-start md:items-center gap-3 flex-1 min-w-0">
          <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />

          <Link
            href={APP_ROUTES.PRODUCT_DETAIL(item.product_id)}
            className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-content/[0.05] bg-content/[0.02]"
          >
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-content/20 bg-content/[0.05]">
                <ShoppingBag size={24} />
              </div>
            )}
          </Link>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-content text-sm md:text-base line-clamp-2 hover:text-blue-600 transition-colors">
              <Link href={APP_ROUTES.PRODUCT_DETAIL(item.product_id)}>
                {item.name}
              </Link>
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {item.attributes && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-content/[0.05] text-content/40">
                  {item.attributes}
                </span>
              )}
              {isOutOfStock ? (
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider bg-red-50 px-1.5 py-0.5 rounded">
                  Hết hàng
                </span>
              ) : (
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">
                  Còn hàng
                </span>
              )}
            </div>
            {isOutOfStock && (
              <p className="text-[11px] text-red-500 mt-2 font-medium">
                Phân loại hàng này bán hết, vui lòng lựa chọn một phân loại
                khác.
              </p>
            )}
          </div>
        </div>

        {/* Desktop Pricing & Quantity */}
        <div className="hidden md:flex items-center gap-4 w-full md:w-auto">
          <div className="w-32 text-center font-bold text-content/80">
            {item.price.toLocaleString("vi-VN")}₫
          </div>

          <div className="w-32 flex justify-center">
            <QuantitySelector
              value={item.quantity}
              onChange={onUpdateQuantity}
              disabled={isOutOfStock}
            />
          </div>

          <div className="w-32 text-center font-black text-blue-600">
            {(item.price * item.quantity).toLocaleString("vi-VN")}₫
          </div>

          <div className="w-24 flex justify-center">
            <button
              onClick={onRemove}
              className="p-2.5 text-content/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Pricing & Quantity */}
        <div className="flex md:hidden items-center justify-between w-full pt-3 border-t border-content/[0.05]">
          <div className="font-black text-blue-600">
            {(item.price * item.quantity).toLocaleString("vi-VN")}₫
          </div>
          <div className="flex items-center gap-4">
            <QuantitySelector
              value={item.quantity}
              onChange={onUpdateQuantity}
              disabled={isOutOfStock}
            />
            <button
              onClick={onRemove}
              className="p-2 text-content/20 hover:text-red-500"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
