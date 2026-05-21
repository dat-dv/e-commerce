"use client";

import { TYPOGRAPHY } from "@/constants/typography";
import React from "react";

interface ListingSectionHeaderProps {
  eyebrow: string;
  title: string;
  icon?: React.ReactNode;
  meta?: React.ReactNode;
}

export const ListingSectionHeader = ({
  eyebrow,
  title,
  icon,
  meta,
}: ListingSectionHeaderProps) => {
  return (
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="text-primary flex min-w-0 items-center gap-2">
          {icon}
          <span
            className={`truncate ${TYPOGRAPHY.badge} text-content/30 tracking-wide uppercase sm:tracking-[0.35em]`}
          >
            {eyebrow}
          </span>
        </div>
        <h2
          className={`mt-2 ${TYPOGRAPHY.sectionTitle} text-content tracking-tight`}
        >
          {title}
        </h2>
      </div>

      {meta ? (
        <div className={`shrink-0 ${TYPOGRAPHY.label} text-content/40`}>
          {meta}
        </div>
      ) : null}
    </div>
  );
};
