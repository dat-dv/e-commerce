"use client";

import { APP_ROUTES } from "@/constants/routes";
import { TYPOGRAPHY } from "@/constants/typography";
import { formatCurrency } from "@/utils/format-currency";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

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
    <div className="bg-surface border-content/[0.03] relative border-t px-6 py-6">
      <div className="mb-4 flex items-end justify-between">
        <div className="space-y-1">
          <span className="text-content/40 block text-xs font-medium">
            {t("subtotal")}
          </span>
          <div className="text-content text-xl leading-none font-bold tracking-tight">
            {formatCurrency(subtotal)}
          </div>
        </div>
        <div className={`text-right ${TYPOGRAPHY.badge} font-semibold`}>
          {t("freeShipping")}
        </div>
      </div>

      <div className="space-y-2">
        {!isCheckoutPage ? (
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Link
              href={APP_ROUTES.CHECKOUT}
              onClick={onClose}
              className="bg-content text-surface shadow-content/5 hover:bg-primary hover:text-primary-foreground group flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold tracking-tight shadow-xl transition-all"
            >
              {t("checkout")}
              <ChevronRight
                size={16}
                className="ml-2 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </motion.div>
        ) : (
          <div className="bg-content/[0.03] text-content/40 border-content/10 flex h-11 w-full items-center justify-center rounded-xl border text-sm font-medium">
            {t("finalizing")}
          </div>
        )}

        <Link
          href={APP_ROUTES.CART}
          onClick={onClose}
          className={`block w-full text-center ${TYPOGRAPHY.caption} text-content/30 hover:text-primary py-1 font-medium transition-colors`}
        >
          {t("viewDetails")}
        </Link>
      </div>
    </div>
  );
};
