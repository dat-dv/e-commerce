"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { cn } from "@/utils/cn";
import { APP_ROUTES } from "@/constants/routes";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { Checkbox } from "./checkbox";
import { QuantitySelector } from "./quantity-selector";
import { formatCurrency } from "@/utils/format-currency";

interface CartItemRowProps {
  item: TCartItem;
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
  const isOutOfStock = item.quantity === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "bg-surface/50 backdrop-blur-xl border rounded-xl p-4 transition-all group relative overflow-hidden",
        isOutOfStock ? "opacity-60 grayscale" : "hover:border-primary/20",
        isSelected
          ? "border-primary/40 bg-primary/[0.02] shadow-sm shadow-primary/5"
          : "border-content/[0.05]",
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        {/* Checkbox & Product Info */}
        <div className="flex items-start md:items-center gap-3 flex-1 min-w-0">
          <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />

          <Link
            href={APP_ROUTES.PRODUCT_DETAIL(item.productId)}
            className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-content/[0.05] bg-content/[0.02]"
          >
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-content/20 bg-content/[0.05]">
                <ShoppingBag size={24} />
              </div>
            )}
          </Link>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-content text-sm md:text-base line-clamp-2 hover:text-primary transition-colors">
              <Link href={APP_ROUTES.PRODUCT_DETAIL(item.productId)}>
                {item.name}
              </Link>
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {item.attributes && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-content/[0.05] text-content/40">
                  {item.attributes}
                </span>
              )}
              {isOutOfStock ? (
                <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                  Out of stock
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-green-500">
                  In stock
                </span>
              )}
            </div>
            {isOutOfStock && (
              <p className="text-[11px] text-red-500 mt-2 font-medium">
                This item is currently unavailable.
              </p>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 w-full md:w-auto">
          <div className="w-32 text-center font-bold text-content/40 text-sm italic font-light">
            {formatCurrency(item.price)}
          </div>

          <div className="w-32 flex justify-center scale-90 group-hover:scale-100 transition-transform duration-500">
            <QuantitySelector
              value={item.quantity}
              onChange={onUpdateQuantity}
              disabled={isOutOfStock}
            />
          </div>

          <div className="w-32 text-center text-xl font-black text-content tracking-tighter">
            {formatCurrency(item.price * item.quantity)}
          </div>

          <div className="w-24 flex justify-center">
            <button
              onClick={onRemove}
              className="p-3 text-content/10 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
