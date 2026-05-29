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

import { cn } from "../../../utils";
import {
  ICommonCellProps,
  ICommonColumnProps,
  ICommonRowProps,
  ICommonTableBodyProps,
  ICommonTableHeaderProps,
  ICommonTableProps,
} from "./table.types";

export function Table({ className, ...props }: ICommonTableProps) {
  return (
    <AriaTable
      {...props}
      className={cn("divide-content/10 min-w-full divide-y text-sm", className)}
    />
  );
}

export function TableHeader<T extends object>({
  className,
  ...props
}: ICommonTableHeaderProps<T>) {
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

export function Column({ className, ...props }: ICommonColumnProps) {
  return <AriaColumn {...props} className={cn("px-4 py-3", className)} />;
}

export function TableBody<T extends object>({
  className,
  ...props
}: ICommonTableBodyProps<T>) {
  return (
    <AriaTableBody
      {...props}
      className={cn("divide-content/10 divide-y", className)}
    />
  );
}

export function Row<T extends object>({
  className,
  ...props
}: ICommonRowProps<T>) {
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

export function Cell({ className, ...props }: ICommonCellProps) {
  return <AriaCell {...props} className={cn("px-4 py-4", className)} />;
}

export { Collection };
