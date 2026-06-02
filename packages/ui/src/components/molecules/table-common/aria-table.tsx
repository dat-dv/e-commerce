"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { type Key } from "react";
import {
  Button,
  Cell as AriaCell,
  type CellProps,
  Collection,
  Column as AriaColumn,
  type ColumnProps,
  ColumnResizer,
  ResizableTableContainer,
  Row as AriaRow,
  type RowProps,
  Table as AriaTable,
  TableBody as AriaTableBody,
  type TableBodyProps,
  TableHeader as AriaTableHeader,
  type TableHeaderProps,
  type TableProps as AriaTableProps,
  useTableOptions,
} from "react-aria-components";

import { cn } from "../../../utils";

type TableProps = Omit<AriaTableProps, "className"> & {
  className?: string;
  onResizeEnd?: (widths: Map<Key, unknown>) => void;
  tableMinWidth?: number;
};

type CommonColumnProps = ColumnProps & {
  isResizable?: boolean;
  headerClassName?: string;
};

export function Table({
  className,
  onResizeEnd,
  onScroll,
  style,
  tableMinWidth,
  ...props
}: TableProps) {
  return (
    <ResizableTableContainer
      onResizeEnd={onResizeEnd}
      onScroll={onScroll}
      className={cn(
        "relative w-full [scrollbar-gutter:stable] overflow-auto",
        className,
      )}
    >
      <AriaTable
        {...props}
        style={{
          ...style,
          minWidth: tableMinWidth,
        }}
        className="w-full table-fixed border-separate border-spacing-0 text-left text-sm"
      />
    </ResizableTableContainer>
  );
}

export function TableHeader<T extends object>(props: TableHeaderProps<T>) {
  const { selectionBehavior, selectionMode } = useTableOptions();

  return (
    <AriaTableHeader
      {...props}
      className="bg-surface/80 sticky top-0 z-20 backdrop-blur-md"
    >
      {selectionBehavior === "toggle" && (
        <AriaColumn
          width={44}
          minWidth={44}
          className="border-content/10 border-r border-b px-3 py-4"
        >
          {selectionMode === "multiple" && (
            <input type="checkbox" aria-label="Select all" />
          )}
        </AriaColumn>
      )}

      <Collection items={props.columns}>{props.children}</Collection>
    </AriaTableHeader>
  );
}

export function Column({
  children,
  headerClassName,
  isResizable = false,
  ...props
}: CommonColumnProps) {
  return (
    <AriaColumn
      {...props}
      className="border-content/10 bg-surface/70 relative overflow-hidden border-r border-b text-start text-xs font-bold tracking-wider uppercase outline-none last:border-r-0"
    >
      {({ allowsSorting, sortDirection }) => (
        <div className="flex h-full min-w-0 items-center overflow-hidden">
          <div
            className={cn(
              "flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden px-4 py-4",
              headerClassName,
            )}
          >
            <span className="truncate">{children as React.ReactNode}</span>

            {allowsSorting && (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center opacity-60">
                {sortDirection === "ascending" ? (
                  <ArrowUp
                    aria-hidden
                    className="text-primary h-3.5 w-3.5 transition-transform"
                  />
                ) : sortDirection === "descending" ? (
                  <ArrowDown
                    aria-hidden
                    className="text-primary h-3.5 w-3.5 transition-transform"
                  />
                ) : (
                  <ArrowUpDown
                    aria-hidden
                    className="h-3.5 w-3.5 transition-opacity"
                  />
                )}
              </span>
            )}
          </div>

          {isResizable && (
            <ColumnResizer className="hover:bg-primary/60 resizing:bg-primary bg-content/20 absolute top-1/2 right-0 h-6 w-px -translate-y-1/2 cursor-col-resize bg-clip-content px-[6px] outline-none" />
          )}
        </div>
      )}
    </AriaColumn>
  );
}

export function TableBody<T extends object>(props: TableBodyProps<T>) {
  return <AriaTableBody {...props} />;
}

export function Row<T extends object>({
  id,
  columns,
  children,
  ...props
}: RowProps<T>) {
  const { selectionBehavior } = useTableOptions();

  return (
    <AriaRow
      id={id}
      {...props}
      className="group/row hover:bg-content/[0.02] selected:bg-content/[0.04] h-[52px] outline-none"
    >
      {selectionBehavior === "toggle" && (
        <Cell>
          <input type="checkbox" slot="selection" className="h-4 w-4" />
        </Cell>
      )}

      <Collection items={columns}>{children}</Collection>
    </AriaRow>
  );
}

type CommonCellProps = CellProps & {
  cellClassName?: string;
};

export function Cell({ cellClassName, children, ...props }: CommonCellProps) {
  return (
    <AriaCell
      {...props}
      className={cn(
        "border-content/5 overflow-hidden border-r border-b px-4 py-4 align-middle outline-none group-last/row:border-b-0 last:border-r-0",
        cellClassName,
      )}
    >
      {typeof children === "function" ? (
        children
      ) : (
        <div className="min-w-0 overflow-hidden">{children}</div>
      )}
    </AriaCell>
  );
}

export { Button };
