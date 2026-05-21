"use client";

import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { TYPOGRAPHY } from "@/constants/typography";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { formatCurrency } from "@/utils/format-currency";
import { motion } from "framer-motion";
import { ImageIcon, Minus, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

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
  const t = useTranslations("CartPage.item");
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
            <ImageIcon size={18} aria-hidden />
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
            <span
              className={`${TYPOGRAPHY.badge} font-medium text-content/30 truncate max-w-[80px]`}
            >
              {item.attributes || t("standard")}
            </span>
            {item.discountPercent && (
              <span
                className={`${TYPOGRAPHY.badge} font-bold text-red-400 bg-red-400/10 px-1 rounded`}
              >
                -{item.discountPercent}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isCheckoutPage && (
              <div className="flex items-center gap-1.5 border border-content/10 rounded-md px-1 py-0.5 bg-surface/50">
                <Button
                  variant="ghost"
                  onClick={() => onAdd(item, -1)}
                  className="text-content/30 hover:text-content transition-colors h-auto p-0 active:scale-100 opacity-100 hover:opacity-100 font-normal hover:bg-transparent"
                  aria-label={t("decrease", { product: item.name })}
                >
                  <Minus size={10} aria-hidden />
                </Button>
                <span
                  className={`${TYPOGRAPHY.badge} font-medium min-w-[12px] text-center`}
                >
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => onAdd(item, 1)}
                  className="text-content/30 hover:text-content transition-colors h-auto p-0 active:scale-100 opacity-100 hover:opacity-100 font-normal hover:bg-transparent"
                  aria-label={t("increase", { product: item.name })}
                >
                  <Plus size={10} aria-hidden />
                </Button>
              </div>
            )}
            {!isCheckoutPage && (
              <Button
                variant="ghost"
                onClick={() => onRemove(item)}
                className="text-content/10 hover:text-red-500/60 transition-colors h-auto p-0 active:scale-95 opacity-100 hover:opacity-100 hover:bg-transparent"
                aria-label={t("remove", { product: item.name })}
              >
                <Trash2 size={12} aria-hidden />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
