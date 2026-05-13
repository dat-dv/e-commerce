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
          className="flex flex-col gap-10"
        >
          {/* Premium Banner */}
          <div className="relative h-[240px] rounded-[32px] overflow-hidden bg-gradient-to-br from-primary/30 via-secondary/20 to-transparent flex items-center px-12 group">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm -z-10" />

            {/* Decorative glowing blobs */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/30 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/30 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />

            <div className="relative z-10 max-w-lg">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-2 block">
                Category
              </span>
              <h1 className="text-4xl font-bold text-neutral-800 mb-3 capitalize">
                {title}
              </h1>
              <p className="text-neutral-600 text-lg leading-relaxed">
                {description}
              </p>
            </div>

            {/* Visual accent */}
            <div className="ml-auto relative hidden md:block">
              <div className="w-24 h-24 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-500 border border-white/50">
                <span className="text-4xl">✨</span>
              </div>
              <div className="w-16 h-16 rounded-xl bg-primary/10 backdrop-blur-md shadow-md flex items-center justify-center absolute -bottom-4 -left-4 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500 delay-75 border border-white/20">
                <span className="text-2xl">🏷️</span>
              </div>
            </div>
          </div>

          {/* Subcategories Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-neutral-800 mb-1">
                  Explore Categories
                </h3>
                <p className="text-neutral-500 text-sm">
                  Find exactly what you are looking for
                </p>
              </div>
              <div className="text-sm text-neutral-400 font-medium">
                {categories.length} Categories
              </div>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
