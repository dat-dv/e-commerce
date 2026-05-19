"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus, ImageIcon } from "lucide-react";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { formatCurrency } from "@/utils/format-currency";
import { APP_ROUTES } from "@/constants/routes";

interface CartItemProps {
  item: TCartItem;
  isCheckoutPage: boolean;
  onAdd: (item: TCartItem, quantity: number) => void;
  onRemove: (item: TCartItem) => void;
  onCloseDrawer: () => void;
}

export const CartItem = ({
  item,
  isCheckoutPage,
  onAdd,
  onRemove,
  onCloseDrawer,
}: CartItemProps) => {
  const imageUrl = item.imageUrl;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group flex gap-4 pt-4 pb-3 border-b border-content/[0.04] last:border-0 relative"
    >
      {/* Balanced Image */}
      <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-content/[0.02] border border-content/5 shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-content/20">
            <ImageIcon size={18} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div className="flex justify-between items-start gap-2">
          <h4 className="text-xs font-medium text-content leading-tight truncate flex-1">
            <Link
              href={APP_ROUTES.PRODUCT_DETAIL(item.productId)}
              onClick={onCloseDrawer}
            >
              {item.name}
            </Link>
          </h4>
          <span className="text-xs font-semibold text-content tabular-nums">
            {formatCurrency(item.price)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-content/30 truncate max-w-[80px]">
              {item.attributes || "Standard"}
            </span>
            {item.discountPercent && (
              <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-1 rounded">
                -{item.discountPercent}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isCheckoutPage && (
              <div className="flex items-center gap-1.5 border border-content/10 rounded-md px-1 py-0.5 bg-surface/50">
                <button
                  onClick={() => onAdd(item, -1)}
                  className="text-content/30 hover:text-content transition-colors"
                >
                  <Minus size={10} />
                </button>
                <span className="text-[10px] font-medium min-w-[12px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onAdd(item, 1)}
                  className="text-content/30 hover:text-content transition-colors"
                >
                  <Plus size={10} />
                </button>
              </div>
            )}
            {!isCheckoutPage && (
              <button
                onClick={() => onRemove(item)}
                className="text-content/10 hover:text-red-500/60 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
