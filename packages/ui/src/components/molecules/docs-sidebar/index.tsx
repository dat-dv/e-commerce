"use client";

import React from "react";

import { TYPOGRAPHY } from "../../../tokens";
import { SidebarDocItem, SidebarItem } from "../../atoms/sidebar-item";

export type { IDocsSidebarProps } from "./docs-sidebar.types";

export interface DocsSidebarProps {
  items: SidebarDocItem[];
  currentPathname: string;
  titleLabel?: string;
  linkComponent?: React.ElementType;
}

export const DocsSidebar = ({
  items,
  currentPathname,
  titleLabel = "Documentation",
  linkComponent,
}: DocsSidebarProps) => {
  // Filter items that have no content AND no children
  const normalizedItems = items.filter(
    (item) => item.href || item.children?.length,
  );

  return (
    <div className="flex h-full w-full flex-col space-y-6 pr-2 pb-12">
      {/* Sidebar Header / Category Label */}
      <div className="flex flex-col gap-1 px-4">
        <h2
          className={`${TYPOGRAPHY.badge} text-primary/40 border-primary/20 border-l-2 py-1 pl-3 tracking-[0.2em] uppercase`}
        >
          {titleLabel}
        </h2>
      </div>

      {/* Navigation Tree */}
      <nav className="flex flex-col gap-0.5 px-2">
        {normalizedItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            currentPathname={currentPathname}
            linkComponent={linkComponent}
          />
        ))}
      </nav>
    </div>
  );
};

DocsSidebar.displayName = "DocsSidebar";

export default DocsSidebar;
