"use client";

import { Button, Portal } from "@ecommerce/ui";
import { CategoryNavSidebar } from "@/components/molecules/category-nav-sidebar";
import { TCategory } from "@/domain/categories/types/categories.model";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
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

  useLockBodyScroll(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[120] h-dvh w-dvw max-w-full overflow-hidden bg-black/35 backdrop-blur-[2px] lg:hidden"
          />

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 230 }}
            className="border-content/10 bg-surface fixed top-0 bottom-0 left-0 z-[121] flex w-full max-w-full min-w-0 flex-col overflow-hidden border-r shadow-2xl sm:w-[380px] sm:max-w-[380px] md:w-[420px] md:max-w-[420px] lg:hidden"
            aria-label={t("title")}
          >
            <div className="border-content/10 flex h-16 shrink-0 items-center justify-between border-b px-4">
              <div className="min-w-0">
                <h2 className="text-content text-sm font-black tracking-[0.18em] uppercase">
                  {t("title")}
                </h2>
                <p className="text-content/45 mt-0.5 line-clamp-1 text-xs font-medium">
                  {t("description")}
                </p>
              </div>

              <Button
                variant="ghost"
                onClick={onClose}
                className="text-content/60 hover:bg-content/5 hover:text-content size-10 shrink-0 rounded-full p-0"
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
        </Portal>
      )}
    </AnimatePresence>
  );
}
