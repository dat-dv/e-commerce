"use client";

import {
  Cell as AriaCell,
  Collection,
  Column as AriaColumn,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableHeader as AriaTableHeader,
} from "react-aria-components";
import type {
  CellProps,
  ColumnProps,
  RowProps,
  TableBodyProps,
  TableHeaderProps,
  TableProps,
} from "react-aria-components";

import { cn } from "@/utils/cn";

interface CommonTableProps extends Omit<TableProps, "className"> {
  className?: string;
}

export function Table({ className, ...props }: CommonTableProps) {
  return (
    <AriaTable
      {...props}
      className={cn("divide-content/10 min-w-full divide-y text-sm", className)}
    />
  );
}

interface CommonTableHeaderProps<T extends object> extends Omit<
  TableHeaderProps<T>,
  "className"
> {
  className?: string;
}

export function TableHeader<T extends object>({
  className,
  ...props
}: CommonTableHeaderProps<T>) {
  return (
    <AriaTableHeader
      {...props}
      className={cn(
        "bg-content/[0.03] text-content/45 text-left text-xs font-semibold uppercase",
        className,
      )}
    />
  );
}

interface CommonColumnProps extends Omit<ColumnProps, "className"> {
  className?: string;
}

export function Column({ className, ...props }: CommonColumnProps) {
  return <AriaColumn {...props} className={cn("px-4 py-3", className)} />;
}

interface CommonTableBodyProps<T extends object> extends Omit<
  TableBodyProps<T>,
  "className"
> {
  className?: string;
}

export function TableBody<T extends object>({
  className,
  ...props
}: CommonTableBodyProps<T>) {
  return (
    <AriaTableBody
      {...props}
      className={cn("divide-content/10 divide-y", className)}
    />
  );
}

interface CommonRowProps<T extends object> extends Omit<
  RowProps<T>,
  "className"
> {
  className?: string;
}

export function Row<T extends object>({
  className,
  ...props
}: CommonRowProps<T>) {
  return (
    <AriaRow
      {...props}
      className={cn(
        "hover:bg-content/[0.025] align-middle focus-visible:outline-none",
        className,
      )}
    />
  );
}

interface CommonCellProps extends Omit<CellProps, "className"> {
  className?: string;
}

export function Cell({ className, ...props }: CommonCellProps) {
  return <AriaCell {...props} className={cn("px-4 py-4", className)} />;
}

export { Collection };
