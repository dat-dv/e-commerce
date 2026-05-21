"use client";

import { TYPOGRAPHY } from "@/constants/typography";
import { FolderTree } from "lucide-react";

export function CategorySidebarHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <FolderTree size={17} strokeWidth={2} aria-hidden />
      </div>

      <div>
        <h2
          className={`${TYPOGRAPHY.sectionTitle} tracking-tight text-content`}
        >
          {title}
        </h2>
        <p className={`${TYPOGRAPHY.meta} text-content/35`}>{description}</p>
      </div>
    </div>
  );
}
