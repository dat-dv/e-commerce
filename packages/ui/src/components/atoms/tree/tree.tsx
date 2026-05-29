"use client";

import React from "react";
import {
  Collection as RACCollection,
  Tree as RACTree,
  type Key,
} from "react-aria-components";

import { cn } from "@/utils/cn";
import { TreeItem } from "./tree-item";
import { ITreeProps } from "./tree.types";

export function AppTree<T extends object>({
  items,
  children,
  className,
  getId,
  getTitle,
  getChildren,
  renderItem,
  showDot,
  activeLayoutId,
  ...props
}: ITreeProps<T>) {
  if (items) {
    const idGetter =
      getId || ((item: T) => (item as Record<string, unknown>).id as Key);
    const titleGetter =
      getTitle ||
      ((item: T) =>
        ((item as Record<string, unknown>).title ||
          (item as Record<string, unknown>).name ||
          "") as string);
    const childrenGetter =
      getChildren ||
      ((item: T) =>
        (item as Record<string, unknown>).children as T[] | undefined);

    const renderNode = (item: T): React.ReactNode => {
      const id = idGetter(item);
      const title = titleGetter(item);
      const childItems = childrenGetter(item);

      return (
        <TreeItem
          key={id}
          id={id}
          title={title}
          showDot={showDot}
          activeLayoutId={activeLayoutId}
        >
          {renderItem ? renderItem(item) : null}
          {childItems && childItems.length > 0 && (
            <RACCollection items={childItems}>
              {(child) => renderNode(child as T)}
            </RACCollection>
          )}
        </TreeItem>
      );
    };

    return (
      <RACTree
        {...props}
        className={cn(
          "border-content/10 bg-surface/50 focus:ring-primary/20 relative w-64 max-w-full overflow-auto rounded-xl border p-1.5 focus:ring-2 focus:outline-none",
          className,
        )}
      >
        <RACCollection items={items}>
          {(item) => renderNode(item)}
        </RACCollection>
      </RACTree>
    );
  }

  return (
    <RACTree
      {...props}
      className={cn(
        "border-content/10 bg-surface/50 focus:ring-primary/20 relative w-64 max-w-full overflow-auto rounded-xl border p-1.5 focus:ring-2 focus:outline-none",
        className,
      )}
    >
      {children}
    </RACTree>
  );
}

export const Tree = AppTree;
