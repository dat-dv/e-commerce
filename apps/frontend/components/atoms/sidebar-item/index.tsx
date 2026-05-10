"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, FileText, FolderClosed, FolderOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";

import { DocItem } from "@/utils/docs";

// ─── Utils ──────────────────────────────────────────────────────────────────

const getTitle = (id: string) => {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

// ─── Presentational Component: SidebarRow ───────────────────────────────────

interface SidebarRowProps {
  item: DocItem;
  depth: number;
  isOpen: boolean;
  isActive: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

const SidebarRow: React.FC<SidebarRowProps> = ({
  item,
  depth,
  isOpen,
  isActive,
  onToggle,
}) => {
  const hasChildren = !!item.children?.length;
  const title = useMemo(() => getTitle(item.id), [item.id]);

  return (
    <div
      className={`relative group flex w-full items-center gap-2.5 py-2 px-3 rounded-xl transition-all duration-300 outline-none ${
        depth > 0 ? "ml-4" : ""
      } ${
        isActive
          ? "bg-primary/10 text-primary shadow-[0_4px_12px_rgba(var(--primary),0.05)]"
          : "hover:bg-content/[0.04] text-content/60 hover:text-content"
      }`}
    >
      {/* Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="active-nav-bg"
          className="absolute inset-0 bg-primary/[0.05] rounded-xl -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}

      {/* Icon */}
      <div className="shrink-0 transition-colors">
        {hasChildren ? (
          isOpen ? (
            <FolderOpen size={14} className="text-primary/70" />
          ) : (
            <FolderClosed size={14} className="text-primary/40" />
          )
        ) : (
          <FileText
            size={14}
            className={isActive ? "text-primary" : "text-content/30"}
          />
        )}
      </div>

      {/* Label */}
      <span className="flex-1 truncate text-[13px] font-medium tracking-tight whitespace-nowrap">
        {title}
      </span>

      {/* Toggle Arrow */}
      {hasChildren && (
        <button
          type="button"
          onClick={onToggle}
          className={`shrink-0 p-1 rounded-md transition-all duration-300 hover:bg-primary/10 ${
            isOpen ? "rotate-90 text-primary" : "text-content/20"
          }`}
        >
          <ChevronRight size={13} strokeWidth={3} />
        </button>
      )}
    </div>
  );
};

// ─── Main SidebarItem Hook / Component ─────────────────────────────────────

export const SidebarItem: React.FC<{ item: DocItem; depth?: number }> = ({
  item,
  depth = 0,
}) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const isChildActive =
    !!item.routePath && pathname.startsWith(`${item.routePath}/`);

  const [isOpen, setIsOpen] = useState(isActive || isChildActive);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const hasChildren = !!item.children?.length;
  const isLink = !!item.href;

  const row = (
    <SidebarRow
      item={item}
      depth={depth}
      isOpen={isOpen}
      isActive={isActive}
      onToggle={handleToggle}
    />
  );

  return (
    <div className="space-y-0.5">
      {isLink ? (
        <Link href={item.href} className="block outline-none">
          {row}
        </Link>
      ) : (
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          {row}
        </div>
      )}

      <AnimatePresence initial={false}>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-l border-primary/10 ml-5"
          >
            <div className="py-1">
              {item.children!.map((child) => (
                <SidebarItem key={child.id} item={child} depth={depth + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
