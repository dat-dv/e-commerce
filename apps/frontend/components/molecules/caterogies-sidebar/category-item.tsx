"use client";

import { motion } from "framer-motion";

import { cn } from "@/utils/cn";

interface ICategoryItemProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const CategoryItem = ({ label, active, onClick }: ICategoryItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors duration-300",
        active ? "text-primary" : "text-content/45 hover:text-content",
      )}
    >
      {active && (
        <motion.div
          layoutId="active-category-sidebar"
          className="absolute inset-0 rounded-2xl bg-primary/10"
          transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
        />
      )}

      <span
        className={cn(
          "relative z-10 size-1.5 rounded-full transition-all duration-300",
          active
            ? "bg-primary"
            : "bg-content/15 opacity-0 group-hover:opacity-100",
        )}
      />

      <span className="relative z-10 truncate text-sm font-semibold capitalize">
        {label}
      </span>
    </button>
  );
};

export default CategoryItem;
