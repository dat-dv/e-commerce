"use client";

import React from "react";
import TableOfContents from "@/components/molecules/toc";
import { useTranslations } from "next-intl";

interface TOCItem {
  id: string;
  title: string;
}

interface PrivacySidebarProps {
  sections: TOCItem[];
}

export function PrivacySidebar({
  sections,
}: PrivacySidebarProps): React.ReactElement {
  const t = useTranslations("Privacy");

  return (
    <div className="min-w-0">
      <h3 className="text-content/40 mb-3 text-sm font-bold tracking-wider uppercase">
        {t("toc")}
      </h3>
      <TableOfContents items={sections} />
    </div>
  );
}

export default PrivacySidebar;
