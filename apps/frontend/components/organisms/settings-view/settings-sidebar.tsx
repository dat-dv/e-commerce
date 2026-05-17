"use client";

import TableOfContents from "@/components/molecules/toc";

interface SettingsSidebarProps {
  items: { id: string; title: string }[];
}

const SettingsSidebar = ({ items }: SettingsSidebarProps) => {
  return (
    <div>
      <h3 className="text-sm font-bold text-content/40 uppercase tracking-wider mb-3">
        Settings
      </h3>
      <TableOfContents items={items} />
    </div>
  );
};

export default SettingsSidebar;
