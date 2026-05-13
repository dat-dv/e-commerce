"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";

import { TBrand } from "@/domain/homepage/types/homepage.model";

interface TopBrandsGridProps {
  brands: TBrand[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
  hover: {
    scale: 1.03,
    boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)",
    transition: {
      duration: 0.3,
      ease: "easeInOut" as const,
    },
  },
  tap: { scale: 0.98 },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 10 },
  hover: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export const TopBrandsGrid = ({ brands }: TopBrandsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {brands.map((brand, index) => (
        <motion.div
          key={brand.id}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          className="h-full"
        >
          <Link
            href={`${APP_ROUTES.PRODUCTS}?brand_id=${brand.id}`}
            className="group relative backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 cursor-pointer overflow-hidden block h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 flex flex-col items-center text-center h-full justify-between">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-600 group-hover:border-primary transition-colors duration-300">
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {brand.name?.charAt(0) || brand.slug?.charAt(0) || "?"}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {brand.name || brand.slug}
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {brand.product_count || 0} Products
                </p>
              </div>

              <motion.div
                variants={buttonVariants}
                initial="hidden"
                animate="hidden"
                whileHover="hover"
                className="mt-4 px-4 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full"
              >
                View Store
              </motion.div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default TopBrandsGrid;
