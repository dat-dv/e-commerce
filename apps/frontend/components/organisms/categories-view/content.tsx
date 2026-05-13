"use client";

import { TCategory } from "@/domain/categories/types/categories.model";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface CategoriesContentProps {
  activeCategory: TCategory | undefined;
}

export const CategoriesContent = ({
  activeCategory,
}: CategoriesContentProps) => {
  return (
    <div className="flex-1 min-w-0">
      <AnimatePresence mode="wait">
        {activeCategory && (
          <motion.div
            key={activeCategory.id}
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
                  {activeCategory.name}
                </h1>
                <p className="text-neutral-600 text-lg leading-relaxed">
                  Explore our curated collection of high-quality products in{" "}
                  {activeCategory.name}.
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
                    Explore Sub Categories
                  </h3>
                  <p className="text-neutral-500 text-sm">
                    Find exactly what you are looking for
                  </p>
                </div>
                <div className="text-sm text-neutral-400 font-medium">
                  {activeCategory.children?.length || 0} Categories
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
                {activeCategory.children?.map((child) => (
                  <Link href={`/categories/${child.slug}`} key={child.id}>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 },
                      }}
                      className="group bg-white/70 backdrop-blur-md border border-neutral-200/60 rounded-3xl p-6 hover:shadow-xl hover:shadow-neutral-100/80 transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between h-full min-h-[150px] cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                            <span className="text-xl text-neutral-600 group-hover:text-primary transition-colors duration-300">
                              📦
                            </span>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <h4 className="font-bold text-lg mb-2 capitalize text-neutral-800 group-hover:text-primary transition-colors duration-300">
                          {child.name}
                        </h4>

                        {/* Sub-sub categories (Level 3) as pills */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {child.children?.slice(0, 3).map((subChild) => (
                            <span
                              key={subChild.id}
                              className="text-xs px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-full hover:bg-primary/10 hover:text-primary cursor-pointer capitalize transition-colors duration-200 font-medium"
                            >
                              {subChild.name}
                            </span>
                          ))}
                          {child.children && child.children.length > 3 && (
                            <span className="text-xs px-2.5 py-1 bg-neutral-50 text-neutral-400 rounded-full font-medium">
                              +{child.children.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
