"use client";
import { LiquidWaveText, ViewAllButton } from "@ecommerce/ui";

import { TYPOGRAPHY } from "@/constants/typography";
import Link from "next/link";
import React from "react";

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
    <div className="flex items-start justify-between gap-3 sm:items-center">
      <div className="flex min-w-0 items-center gap-3 sm:gap-6">
        <div className="flex min-w-0 items-center gap-3">
          {href ? (
            <Link href={href} className="min-w-0">
              <h2
                className={`flex min-w-0 cursor-pointer items-center gap-2 ${TYPOGRAPHY.sectionTitle} text-content hover:text-primary leading-tight capitalize transition-colors`}
              >
                {icon}
                <LiquidWaveText
                  className="min-w-0 truncate"
                  inactiveClassName="text-content"
                >
                  {title}
                </LiquidWaveText>
              </h2>
            </Link>
          ) : (
            <h2
              className={`flex min-w-0 items-center gap-2 ${TYPOGRAPHY.sectionTitle} text-content leading-tight capitalize`}
            >
              {icon}
              <span className="truncate">{title}</span>
            </h2>
          )}
        </div>

        {children}
      </div>

      {href && <ViewAllButton href={href} />}
    </div>
  );
};
