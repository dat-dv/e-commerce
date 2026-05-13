"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { ViewAllButton } from "@/components/atoms/view-all-button";

interface SectionHeaderProps {
  title: string;
  href?: string;
  icon?: LucideIcon;
  lang?: string;
  children?: React.ReactNode;
}

export const SectionHeader = ({
  title,
  href,
  icon: Icon,
  lang = "vi",
  children,
}: SectionHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {href ? (
          <Link href={href} className="w-fit">
            <h2 className="text-xl font-bold text-content flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
              {Icon && <Icon className="w-5 h-5 text-purple-500" />}
              {title}
            </h2>
          </Link>
        ) : (
          <h2 className="text-xl font-bold text-content flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-purple-500" />}
            {title}
          </h2>
        )}

        {children}
      </div>

      {href && <ViewAllButton href={href} lang={lang} />}
    </div>
  );
};
