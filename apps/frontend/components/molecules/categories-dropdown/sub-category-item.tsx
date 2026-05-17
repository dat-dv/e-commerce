"use client";

import { cn } from "@/utils/cn";
import Link from "next/link";

const SubCategoryItem = ({
  name,
  href,
  isActive,
  className,
}: {
  name: string;
  href: string;
  isActive?: boolean;
  className?: string;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "min-w-fit px-4 py-1.5 rounded-full border font-bold transition-all text-[12px]",
        isActive
          ? "border-primary text-primary bg-primary/5"
          : "border-content/10 text-content/80 hover:text-primary hover:border-primary/30 hover:bg-primary/5",
        className,
      )}
    >
      {name}
    </Link>
  );
};
export default SubCategoryItem;
