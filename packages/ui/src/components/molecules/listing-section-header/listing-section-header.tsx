"use client";

import React from "react";

import { TYPOGRAPHY } from "../../../tokens";
import { cn } from "../../../utils";
import { IListingSectionHeaderProps } from "./listing-section-header.types";

export const ListingSectionHeader = ({
  eyebrow,
  title,
  icon,
  meta,
  className,
}: IListingSectionHeaderProps) => {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
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

ListingSectionHeader.displayName = "ListingSectionHeader";
