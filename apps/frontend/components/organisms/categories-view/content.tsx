"use client";

import { TCategory } from "@/domain/categories/types/categories.model";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryCard } from "@/components/molecules/category-card";
import { Grid2X2 } from "lucide-react";

interface CategoriesContentProps {
  categories: TCategory[];
  activeId: string;
}

export const CategoriesContent = ({
  categories,
  activeId,
}: CategoriesContentProps) => {
  return (
    <div className="min-w-0 flex-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 border-b border-content/[0.04] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Grid2X2 size={16} strokeWidth={2.2} />
                  </div>

                  <span className="text-xs font-black uppercase tracking-[0.18em] text-primary/80">
                    Browse
                  </span>
                </div>

                <h3 className="text-2xl font-black tracking-tight text-content">
                  Discover Categories
                </h3>

                <p className="mt-1 text-sm font-medium text-content/40">
                  Explore collections and find what fits your needs.
                </p>
              </div>

              <div className="w-fit rounded-full border border-content/[0.05] bg-content/[0.02] px-4 py-2 text-xs font-bold text-content/40">
                {categories.length} categories
              </div>
            </div>

            <motion.div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.06 },
                },
              }}
              initial="hidden"
              animate="show"
            >
              {categories.map((child) => (
                <motion.div
                  key={child.id}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <CategoryCard
                    name={child.name}
                    count={`${child.children?.length || 0} Categories`}
                    href={`/categories/${child.slug}`}
                    showCount={!!child?.children?.length}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
