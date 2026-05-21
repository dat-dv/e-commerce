"use client";

import Button from "@/components/atoms/button";
import { ProductFilterSidebar } from "@/components/molecules/product-filter-sidebar";
import { IProductFilterSidebarProps } from "@/components/molecules/product-filter-sidebar/product-filter-sidebar.types";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProductFilterDrawerProps<
  T extends string = string,
> extends IProductFilterSidebarProps<T> {
  isOpen: boolean;
  onClose: () => void;
}

export function ProductFilterDrawer<T extends string = string>({
  isOpen,
  onClose,
  ...filterProps
}: ProductFilterDrawerProps<T>) {
  const t = useTranslations("ProductsPage");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/35 backdrop-blur-[2px] lg:hidden"
          />

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 230 }}
            className="border-content/10 bg-surface fixed top-0 bottom-0 left-0 z-[91] flex w-[88vw] max-w-[390px] flex-col border-r shadow-2xl md:max-w-[430px] lg:hidden"
            aria-label={t("filters")}
          >
            <div className="border-content/10 flex h-16 shrink-0 items-center justify-between border-b px-4">
              <div className="min-w-0">
                <h2 className="text-content truncate text-sm font-black tracking-[0.18em] uppercase">
                  {t("filters")}
                </h2>
                <p className="text-content/45 mt-0.5 line-clamp-1 text-xs font-medium">
                  {t("filterDrawerDescription")}
                </p>
              </div>

              <Button
                variant="ghost"
                onClick={onClose}
                className="text-content/60 hover:bg-content/5 hover:text-content size-10 shrink-0 rounded-full p-0"
                aria-label={t("closeFilters")}
                title={t("closeFilters")}
              >
                <X size={18} />
              </Button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <ProductFilterSidebar<T> {...filterProps} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
