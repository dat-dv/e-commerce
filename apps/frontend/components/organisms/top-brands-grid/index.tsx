"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";

import { TBrand } from "@/domain/homepage/types/homepage.model";
import Image from "next/image";

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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
      {brands.map((brand, index) => {
        const isLarge = index === 0 || index === 5 || index === 10;

        return (
          <motion.div
            key={brand.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            className={`group relative ${isLarge ? "md:col-span-2 md:row-span-1" : "md:col-span-1"}`}
          >
            <Link
              href={APP_ROUTES.BRAND_DETAIL(brand.slug)}
              className="relative flex flex-col h-full rounded-[2.5rem] overflow-hidden border border-content/[0.08] shadow-lg transition-all duration-500 bg-background group-hover:border-primary/50"
            >
              {/* Background Image/Banner */}
              <div className="absolute inset-0 z-0">
                {brand.banner_url ? (
                  <Image
                    src={brand.banner_url}
                    alt={brand.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-content/[0.03]" />
                )}
                {/* Glass Overlay */}
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] group-hover:backdrop-blur-[1px] transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>

              {/* Content Container */}
              <div className="relative z-10 flex flex-col h-full p-8 justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 p-3 rounded-2xl bg-background/90 backdrop-blur-xl shadow-xl flex items-center justify-center border border-content/[0.05]">
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        {brand.name?.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      {brand.product_count || 0} Items
                    </span>
                  </div>
                </div>

                <div className="mt-auto">
                  <h3
                    className={`font-black text-content mb-2 transition-colors duration-300 group-hover:text-primary ${isLarge ? "text-4xl" : "text-2xl"}`}
                  >
                    {brand.name}
                  </h3>

                  {brand.description && (
                    <p className="text-sm text-content/60 line-clamp-2 max-w-[280px] mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      {brand.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span>Explore Collection</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Decorative Shine */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-tr from-primary/10 via-transparent to-transparent transition-opacity duration-500" />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TopBrandsGrid;
