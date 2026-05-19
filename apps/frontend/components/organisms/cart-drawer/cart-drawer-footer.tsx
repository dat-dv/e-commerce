"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";
import { APP_ROUTES } from "@/constants/routes";
import { useTranslations } from "next-intl";

interface CartDrawerFooterProps {
  subtotal: number;
  isCheckoutPage: boolean;
  onClose: () => void;
}

export const CartDrawerFooter = ({
  subtotal,
  isCheckoutPage,
  onClose,
}: CartDrawerFooterProps) => {
  const t = useTranslations("CartPage.drawer");

  return (
    <div className="px-6 py-6 bg-surface border-t border-content/[0.03] relative">
      <div className="flex items-end justify-between mb-4">
        <div className="space-y-1">
          <span className="text-xs font-medium text-content/40 block">
            {t("subtotal")}
          </span>
          <div className="text-xl font-bold tracking-tight text-content leading-none">
            {formatCurrency(subtotal)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold">{t("freeShipping")}</div>
        </div>
      </div>

      <div className="space-y-2">
        {!isCheckoutPage ? (
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Link
              href={APP_ROUTES.CHECKOUT}
              onClick={onClose}
              className="w-full h-11 flex items-center justify-center bg-content text-surface rounded-xl font-bold text-sm tracking-tight shadow-xl shadow-content/5 hover:bg-primary hover:text-primary-foreground transition-all group"
            >
              {t("checkout")}
              <ChevronRight
                size={16}
                className="ml-2 group-hover:translate-x-1 transition-transform"
                aria-hidden
              />
            </Link>
          </motion.div>
        ) : (
          <div className="w-full h-11 flex items-center justify-center bg-content/[0.03] text-content/40 rounded-xl font-medium text-sm border border-content/10">
            {t("finalizing")}
          </div>
        )}

        <Link
          href={APP_ROUTES.CART}
          onClick={onClose}
          className="w-full block text-center text-[11px] font-medium text-content/30 hover:text-primary transition-colors py-1"
        >
          {t("viewDetails")}
        </Link>
      </div>
    </div>
  );
};
