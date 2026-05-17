"use client";

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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-primary">
          {icon}
          <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-content/30">
            {eyebrow}
          </span>
        </div>
        <h2 className="mt-2 text-2xl font-black text-content tracking-tight">
          {title}
        </h2>
      </div>

      {meta ? (
        <div className="text-sm font-semibold text-content/40">{meta}</div>
      ) : null}
    </div>
  );
};
