"use client";

import Button from "@/components/atoms/button";
import { CategoryNavSidebar } from "@/components/molecules/category-nav-sidebar";
import { TCategory } from "@/domain/categories/types/categories.model";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface ICategoriesFilterDrawerProps {
  isOpen: boolean;
  categories: TCategory[];
  activeId: string;
  setActiveId: (id: string) => void;
  onClose: () => void;
}

export function CategoriesFilterDrawer({
  isOpen,
  categories,
  activeId,
  setActiveId,
  onClose,
}: ICategoriesFilterDrawerProps) {
  const t = useTranslations("CategoriesPage.sidebar");

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
            className="fixed bottom-0 left-0 top-0 z-[91] flex w-[88vw] max-w-[380px] flex-col border-r border-content/10 bg-surface shadow-2xl md:max-w-[420px] lg:hidden"
            aria-label={t("title")}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-content/10 px-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.18em] text-content">
                  {t("title")}
                </h2>
                <p className="mt-0.5 text-xs font-medium text-content/45">
                  {t("description")}
                </p>
              </div>

              <Button
                variant="ghost"
                onClick={onClose}
                className="size-10 rounded-full p-0 text-content/60 hover:bg-content/5 hover:text-content"
                aria-label={t("closeDrawer")}
                title={t("closeDrawer")}
              >
                <X size={18} />
              </Button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <CategoryNavSidebar
                categories={categories}
                activeId={activeId}
                setActiveId={setActiveId}
                onSelectCategory={onClose}
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
