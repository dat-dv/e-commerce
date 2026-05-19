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
    <div>
      <h3 className="text-sm font-bold text-content/40 uppercase tracking-wider mb-3">
        {t("toc")}
      </h3>
      <TableOfContents items={sections} />
    </div>
  );
}

export default TermsSidebar;
