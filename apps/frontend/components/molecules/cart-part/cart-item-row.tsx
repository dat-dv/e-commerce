"use client";

import Button from "@/components/atoms/button";
import { Checkbox } from "@/components/atoms/checkbox";
import { APP_ROUTES } from "@/constants/routes";
import { TCartItem } from "@/store/cart-store/cart-store.type";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format-currency";
import { motion } from "framer-motion";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { QuantitySelector } from "./quantity-selector";

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
  const t = useTranslations("CartPage.item");
  const tTable = useTranslations("CartPage.table");
  const isOutOfStock = item.quantity === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-surface/50 p-3 transition-all backdrop-blur-xl sm:p-4",
        isOutOfStock ? "opacity-60 grayscale" : "hover:border-primary/20",
        isSelected
          ? "border-primary/40 bg-primary/[0.02] shadow-sm shadow-primary/5"
          : "border-content/[0.05]",
      )}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 bg-primary/5 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center">
        {/* Checkbox & Product Info */}
        <div className="flex min-w-0 flex-1 items-start gap-3 md:items-center">
          <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />

          <Link
            href={APP_ROUTES.PRODUCT_DETAIL(item.productId)}
            className="relative block size-20 shrink-0 overflow-hidden rounded-xl border border-content/[0.05] bg-content/[0.02] sm:size-24 md:size-20"
          >
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 80px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-content/[0.05] text-content/20">
                <ShoppingBag size={24} aria-hidden />
              </div>
            )}
          </Link>

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm font-bold text-content transition-colors hover:text-primary md:text-base">
              <Link href={APP_ROUTES.PRODUCT_DETAIL(item.productId)}>
                {item.name}
              </Link>
            </h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {item.attributes && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-content/[0.05] text-content/40">
                  {item.attributes}
                </span>
              )}
              {isOutOfStock ? (
                <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                  {t("outOfStock")}
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-green-500">
                  {t("inStock")}
                </span>
              )}
            </div>
            {isOutOfStock && (
              <p className="mt-2 text-[11px] font-medium text-red-500">
                {t("unavailable")}
              </p>
            )}
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-3 border-t border-content/[0.05] pt-4 md:flex md:w-auto md:items-center md:gap-4 md:border-t-0 md:pt-0">
          <div className="min-w-0 md:w-32 md:text-center">
            <div className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-content/30 md:hidden">
              {tTable("unitPrice")}
            </div>
            <div className="text-sm font-semibold text-content/50 md:font-light md:italic md:text-content/40">
              {formatCurrency(item.price)}
            </div>
          </div>

          <div className="flex min-w-0 justify-end md:w-32 md:justify-center md:transition-transform md:duration-500 md:group-hover:scale-100">
            <div>
              <div className="mb-1 text-right text-[10px] font-black uppercase tracking-[0.16em] text-content/30 md:hidden">
                {tTable("quantity")}
              </div>
              <QuantitySelector
                value={item.quantity}
                onChange={onUpdateQuantity}
                disabled={isOutOfStock}
                className="justify-end"
              />
            </div>
          </div>

          <div className="min-w-0 md:w-32 md:text-center">
            <div className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-content/30 md:hidden">
              {tTable("total")}
            </div>
            <div className="text-lg font-black tracking-tight text-content md:text-xl md:tracking-tighter">
              {formatCurrency(item.price * item.quantity)}
            </div>
          </div>

          <div className="flex justify-end md:w-24 md:justify-center">
            <Button
              variant="ghost"
              onClick={onRemove}
              className="h-10 rounded-lg px-3 text-content/30 opacity-100 transition-all hover:bg-red-500/5 hover:text-red-500 hover:opacity-100 active:scale-95 md:h-auto md:p-3 md:text-content/10"
              aria-label={t("remove", { product: item.name })}
            >
              <Trash2 size={16} aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
