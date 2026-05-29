"use client";

import { Button } from "@ecommerce/ui";
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
      className="group border-content/[0.04] relative flex gap-4 border-b pt-4 pb-3 last:border-0"
    >
      {/* Balanced Image */}
      <div className="bg-content/[0.02] border-content/5 relative h-18 w-14 shrink-0 overflow-hidden rounded-lg border">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="text-content/20 flex h-full w-full items-center justify-center">
            <ImageIcon size={18} aria-hidden />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-content flex-1 truncate text-xs leading-tight font-medium">
            <Link
              href={APP_ROUTES.PRODUCT_DETAIL(item.productId)}
              onClick={onCloseDrawer}
            >
              {item.name}
            </Link>
          </h4>
          <span className="text-content text-xs font-semibold tabular-nums">
            {formatCurrency(item.price)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`${TYPOGRAPHY.badge} text-content/30 max-w-[80px] truncate font-medium`}
            >
              {item.attributes || t("standard")}
            </span>
            {item.discountPercent && (
              <span
                className={`${TYPOGRAPHY.badge} rounded bg-red-400/10 px-1 font-bold text-red-400`}
              >
                -{item.discountPercent}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isCheckoutPage && (
              <div className="border-content/10 bg-surface/50 flex items-center gap-1.5 rounded-md border px-1 py-0.5">
                <Button
                  variant="ghost"
                  onClick={() => onAdd(item, -1)}
                  className="text-content/30 hover:text-content h-auto p-0 font-normal opacity-100 transition-colors hover:bg-transparent hover:opacity-100 active:scale-100"
                  aria-label={t("decrease", { product: item.name })}
                >
                  <Minus size={10} aria-hidden />
                </Button>
                <span
                  className={`${TYPOGRAPHY.badge} min-w-[12px] text-center font-medium`}
                >
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => onAdd(item, 1)}
                  className="text-content/30 hover:text-content h-auto p-0 font-normal opacity-100 transition-colors hover:bg-transparent hover:opacity-100 active:scale-100"
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
                className="text-content/10 h-auto p-0 opacity-100 transition-colors hover:bg-transparent hover:text-red-500/60 hover:opacity-100 active:scale-95"
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
