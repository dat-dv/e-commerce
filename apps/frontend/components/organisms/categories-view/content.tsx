"use client";

import { TCategory } from "@/domain/categories/types/categories.model";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryCard } from "@/components/molecules/category-card";

interface CategoriesContentProps {
  title: string;
  description: string;
  categories: TCategory[];
  activeId: string;
}

export const CategoriesContent = ({
  title,
  description,
  categories,
  activeId,
}: CategoriesContentProps) => {
  return (
    <div className="flex-1 min-w-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="flex flex-col gap-12"
        >
          {/* Premium Banner */}
          <div className="relative h-[280px] rounded-[3rem] overflow-hidden bg-surface/50 backdrop-blur-xl border border-content/5 flex items-center px-16 group">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none group-hover:scale-125 transition-transform duration-1000" />

            <div className="relative z-10 max-w-xl">
              <h1 className="capitalize text-4xl md:text-5xl font-bold text-content tracking-tight leading-tight mb-4">
                {title}
              </h1>
              <p className="text-content/50 text-lg leading-relaxed font-medium">
                {description}
              </p>
            </div>

            {/* Visual accent */}
            <div className="ml-auto relative hidden lg:block pr-8">
              <div className="w-24 h-24 rounded-2xl bg-content/[0.02] backdrop-blur-md flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-700 border border-content/5">
                <span className="text-4xl opacity-30 group-hover:opacity-100 transition-opacity">
                  ✨
                </span>
              </div>
            </div>
          </div>

          {/* Subcategories Section */}
          <div>
            <div className="flex items-center justify-between mb-8 border-b border-content/[0.05] pb-6 px-4">
              <div>
                <h3 className="text-xl font-bold text-content tracking-tight">
                  Discover Categories
                </h3>
              </div>
              <div className="text-xs font-bold text-content/40 bg-content/[0.03] px-4 py-1.5 rounded-full border border-content/[0.05]">
                {categories.length} Categories
              </div>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              {categories.map((child) => (
                <motion.div
                  key={child.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
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
