"use client";

import React from "react";
import {
  type Key,
  type TreeItemProps as RACTreeItemProps,
  type TreeProps as RACTreeProps,
} from "react-aria-components";

export interface ITreeProps<T> extends Omit<
  RACTreeProps<T>,
  "children" | "className"
> {
  className?: string;
  items?: T[];
  children?: React.ReactNode;
  getId?: (item: T) => Key;
  getTitle?: (item: T) => string;
  getChildren?: (item: T) => T[] | undefined;
  renderItem?: (item: T) => React.ReactNode;
}

export interface ITreeItemProps extends Partial<RACTreeItemProps> {
  title: string;
  children?: React.ReactNode;
  className?: RACTreeItemProps["className"];
}
