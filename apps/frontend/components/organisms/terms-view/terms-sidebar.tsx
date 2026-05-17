"use client";

import React from "react";
import TableOfContents from "@/components/molecules/toc";

interface TOCItem {
  id: string;
  title: string;
}

interface TermsSidebarProps {
  sections: TOCItem[];
  isVi: boolean;
}

export function TermsSidebar({
  sections,
  isVi,
}: TermsSidebarProps): React.ReactElement {
  return (
    <div>
      <h3 className="text-sm font-bold text-content/40 uppercase tracking-wider mb-3">
        {isVi ? "Mục lục" : "Table of Contents"}
      </h3>
      <TableOfContents items={sections} />
    </div>
  );
}

export default TermsSidebar;
