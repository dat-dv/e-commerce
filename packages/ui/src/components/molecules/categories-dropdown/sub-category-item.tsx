"use client";

import LiquidWaveText from "@/components/atoms/liquid-wave-text";
import { TYPOGRAPHY } from "@/constants/typography";
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
        "min-w-fit rounded-full border px-4 py-1.5 font-bold transition-all",
        TYPOGRAPHY.caption,
        isActive
          ? "border-primary text-primary bg-primary/5"
          : "border-content/10 text-content/80 hover:border-primary/30 hover:bg-primary/5",
        className,
      )}
    >
      <LiquidWaveText isActive={isActive} inactiveClassName="text-content/80">
        {name}
      </LiquidWaveText>
    </Link>
  );
};
export default SubCategoryItem;
