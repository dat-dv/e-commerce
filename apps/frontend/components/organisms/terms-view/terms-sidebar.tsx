"use client";

import { TableOfContents } from "@ecommerce/ui";
import { useTranslations } from "next-intl";
import React from "react";

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
    <div className="w-full min-w-0">
      <h3 className="text-content/40 mb-3 text-sm font-bold tracking-wider uppercase">
        {t("toc")}
      </h3>
      <TableOfContents items={sections} />
    </div>
  );
}

export default TermsSidebar;
