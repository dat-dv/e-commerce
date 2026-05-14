"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useCategoriesStore } from "@/hooks/categories/use-categories-store";
import { APP_ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

interface CategoryMegaMenuProps {
  label: string;
  isActive: boolean;
}

export const CategoryMegaMenu = ({
  label,
  isActive,
}: CategoryMegaMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const categories = useCategoriesStore((s) => s.categories);

  return (
    <div
      className="relative h-full flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={cn(
          "relative text-sm font-bold transition-all hover:text-primary flex items-center gap-1 h-full",
          isActive ? "text-primary" : "text-content/40 hover:text-content/60",
        )}
      >
        {label}
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />
        {isActive && (
          <span className="absolute -bottom-[22px] left-0 h-[2.5px] w-full bg-primary rounded-full shadow-[0_-2px_8px_rgba(var(--primary),0.4)]" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-[calc(100%+22px)] left-1/2 -translate-x-1/2 w-[700px] bg-surface border border-content/[0.08] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] rounded-xl overflow-hidden z-50 p-8 backdrop-blur-2xl bg-surface/95"
          >
            {/* Transparent bridge to prevent menu from closing when moving mouse */}
            <div className="absolute -top-[22px] left-0 w-full h-[22px]" />

            <div className="grid grid-cols-3 gap-10">
              {categories.slice(0, 6).map((cat) => (
                <div key={cat.id} className="flex flex-col gap-4">
                  <Link
                    href={APP_ROUTES.CATEGORY_DETAIL(cat.slug)}
                    className="group flex items-center justify-between"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-sm font-black uppercase tracking-wider text-content group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                    <ArrowRight
                      size={12}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary"
                    />
                  </Link>

                  <div className="flex flex-col gap-2">
                    {cat.children?.slice(0, 5).map((child) => (
                      <Link
                        key={child.id}
                        href={APP_ROUTES.CATEGORY_DETAIL(child.slug)}
                        className="text-xs text-content/50 hover:text-primary hover:pl-1 transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                    {cat.children && cat.children.length > 5 && (
                      <Link
                        href={APP_ROUTES.CATEGORY_DETAIL(cat.slug)}
                        className="text-[10px] font-bold text-primary hover:underline pt-1"
                        onClick={() => setIsOpen(false)}
                      >
                        View all
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-content/[0.05] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-content">
                  {`Don't see what you're looking for?`}
                </span>
                <span className="text-[10px] text-content/40">
                  Browse our complete collection of high-end essentials.
                </span>
              </div>
              <Link
                href={APP_ROUTES.PRODUCTS}
                className="px-4 py-2 bg-content/[0.03] border border-content/[0.1] text-content rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all"
                onClick={() => setIsOpen(false)}
              >
                All Products
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
