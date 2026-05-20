"use client";

import React from "react";
import TableOfContents from "@/components/molecules/toc";
import { useTranslations } from "next-intl";

interface TOCItem {
  id: string;
  title: string;
}

interface TermsSidebarProps {
  sections: TOCItem[];
}

export function TermsSidebar({
  sections,
}: TermsSidebarProps): React.ReactElement {
  const t = useTranslations("Terms");

  return (
    <div className="min-w-0">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-content/40">
        {t("toc")}
      </h3>
      <TableOfContents items={sections} />
    </div>
  );
}

export default TermsSidebar;
