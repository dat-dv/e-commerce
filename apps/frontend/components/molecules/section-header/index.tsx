"use client";

import React from "react";
import Link from "next/link";
import { ViewAllButton } from "@/components/atoms/view-all-button";

interface SectionHeaderProps {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const SectionHeader = ({
  title,
  href,
  icon,
  children,
}: SectionHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          {href ? (
            <Link href={href} className="w-fit">
              <h2 className="capitalize text-xl font-bold text-content flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                {icon}
                {title}
              </h2>
            </Link>
          ) : (
            <h2 className="capitalize text-xl font-bold text-content flex items-center gap-2">
              {icon}
              {title}
            </h2>
          )}
        </div>

        {children}
      </div>

      {href && <ViewAllButton href={href} />}
    </div>
  );
};
