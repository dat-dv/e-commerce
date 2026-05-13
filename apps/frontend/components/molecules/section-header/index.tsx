"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  href?: string;
  icon?: LucideIcon;
  lang?: string;
}

export const SectionHeader = ({
  title,
  href,
  icon: Icon,
  lang = "vi",
}: SectionHeaderProps) => {
  const viewAllText = lang === "vi" ? "Xem tất cả" : "View All";

  return (
    <div className="flex items-center justify-between">
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

      {href && (
        <Link
          href={href}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          {viewAllText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};
