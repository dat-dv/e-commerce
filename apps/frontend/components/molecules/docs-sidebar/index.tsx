"use client";

import { SidebarItem } from "@/components/atoms/sidebar-item";
import { DocItem } from "@/utils/docs";

import { TYPOGRAPHY } from "@/constants/typography";

// ─── Main Sidebar Molecule ──────────────────────────────────────────────────

export const DocsSidebar = ({ items }: { items: DocItem[] }) => {
  // Filter items that have no content AND no children
  const normalizedItems = items.filter(
    (item) => item.href || item.children?.length,
  );

  return (
    <div className="w-full h-full flex flex-col pr-2 pb-12 space-y-6">
      {/* Sidebar Header / Category Label */}
      <div className="flex flex-col gap-1 px-4">
        <h2
          className={`${TYPOGRAPHY.badge} uppercase tracking-[0.2em] text-primary/40 border-l-2 border-primary/20 pl-3 py-1`}
        >
          Documentation
        </h2>
      </div>

      {/* Navigation Tree */}
      <nav className="flex flex-col gap-0.5 px-2">
        {normalizedItems.map((item) => (
          <SidebarItem key={item.id} item={item} />
        ))}
      </nav>
    </div>
  );
};
