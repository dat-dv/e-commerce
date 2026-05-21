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
            className="border-content/10 bg-surface fixed top-0 bottom-0 left-0 z-[91] flex w-[88vw] max-w-[380px] flex-col border-r shadow-2xl md:max-w-[420px] lg:hidden"
            aria-label={t("title")}
          >
            <div className="border-content/10 flex h-16 shrink-0 items-center justify-between border-b px-4">
              <div>
                <h2 className="text-content text-sm font-black tracking-[0.18em] uppercase">
                  {t("title")}
                </h2>
                <p className="text-content/45 mt-0.5 text-xs font-medium">
                  {t("description")}
                </p>
              </div>

              <Button
                variant="ghost"
                onClick={onClose}
                className="text-content/60 hover:bg-content/5 hover:text-content size-10 rounded-full p-0"
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
