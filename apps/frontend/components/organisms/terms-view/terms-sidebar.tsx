"use client";

import React from "react";
import TableOfContents from "@/components/molecules/toc";

interface TOCItem {
  id: string;
  title: string;
}

interface TermsSidebarProps {
  sections: TOCItem[];
  lang: "en" | "vi";
}

export function TermsSidebar({
  sections,
  lang,
}: TermsSidebarProps): React.ReactElement {
  return (
    <div>
      <h3 className="text-sm font-bold text-content/40 uppercase tracking-wider mb-3">
        {lang === "vi" ? "Mục lục" : "Table of Contents"}
      </h3>
      <TableOfContents items={sections} />
    </div>
  );
}

export default TermsSidebar;
