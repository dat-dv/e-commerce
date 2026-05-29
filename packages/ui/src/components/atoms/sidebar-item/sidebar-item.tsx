"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, FileText, FolderClosed, FolderOpen } from "lucide-react";
import React, { useMemo, useState } from "react";

import { TYPOGRAPHY } from "../../../tokens";
import { LiquidWaveText } from "../liquid-wave-text";
import { ISidebarDocItem, ISidebarItemProps } from "./sidebar-item.types";

export type SidebarItemProps = ISidebarItemProps;

const getTitle = (id: string) => {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

interface SidebarRowProps {
  item: ISidebarDocItem;
  depth: number;
  isOpen: boolean;
  isActive: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

export const SidebarRow = ({
  item,
  depth,
  isOpen,
  isActive,
  onToggle,
}: SidebarRowProps) => {
  const hasChildren = !!item.children?.length;
  const title = useMemo(() => getTitle(item.id), [item.id]);

  return (
    <div
      className={`group relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2 transition-all duration-300 outline-none ${
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
          className="bg-primary/[0.05] absolute inset-0 -z-10 rounded-xl"
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
      <LiquidWaveText
        isActive={isActive}
        className={`min-w-0 flex-1 truncate ${TYPOGRAPHY.bodySmall} font-medium tracking-tight whitespace-nowrap`}
        inactiveClassName="text-content/60"
      >
        {title}
      </LiquidWaveText>

      {/* Toggle Arrow */}
      {hasChildren && (
        <button
          type="button"
          onClick={onToggle}
          className={`hover:bg-primary/10 shrink-0 rounded-md p-1 transition-all duration-300 ${
            isOpen ? "text-primary rotate-90" : "text-content/20"
          }`}
        >
          <ChevronRight size={13} strokeWidth={3} />
        </button>
      )}
    </div>
  );
};

export const SidebarItem = ({
  item,
  currentPathname,
  depth = 0,
  linkComponent: LinkComponent = "a",
}: ISidebarItemProps) => {
  const isActive = currentPathname === item.href;
  const isChildActive =
    !!item.routePath && currentPathname.startsWith(`${item.routePath}/`);

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
        <LinkComponent href={item.href} className="block outline-none">
          {row}
        </LinkComponent>
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
            className="border-primary/10 ml-5 overflow-hidden border-l"
          >
            <div className="py-1">
              {item.children!.map((child) => (
                <SidebarItem
                  key={child.id}
                  item={child}
                  currentPathname={currentPathname}
                  depth={depth + 1}
                  linkComponent={LinkComponent}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

SidebarItem.displayName = "SidebarItem";

export default SidebarItem;
