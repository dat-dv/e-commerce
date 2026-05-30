import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { type Key } from "react";

import { cn } from "../../../utils";
import type { ITableCommonProps } from "./table-common.types";

export default function TableCommon<T>({
  data,
  columns,
  loading = false,
  error = null,
  sortDescriptor,
  onSortChange,
  onRowClick,
  className,
  emptyState,
  rowKey,
  ...rest
}: ITableCommonProps<T>) {
  const getRowKey = (item: T, index: number): Key => {
    if (rowKey) return rowKey(item);
    const itemAny = item as any;
    return itemAny?.id || itemAny?.key || index;
  };

  const handleSort = (columnKey: string) => {
    if (!onSortChange) return;

    if (sortDescriptor?.column === columnKey) {
      onSortChange({
        column: columnKey,
        direction:
          sortDescriptor.direction === "ascending" ? "descending" : "ascending",
      });
    } else {
      onSortChange({
        column: columnKey,
        direction: "ascending",
      });
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] shadow-xl backdrop-blur-xl",
        className,
      )}
      {...rest}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.01] text-xs font-bold tracking-wider text-white/50 uppercase">
              {columns.map((column) => {
                const isSorted = sortDescriptor?.column === column.key;
                const sortDir = isSorted ? sortDescriptor?.direction : null;

                return (
                  <th
                    key={column.key}
                    onClick={() => column.sortable && handleSort(column.key)}
                    className={cn(
                      "px-6 py-4 font-semibold select-none",
                      column.sortable &&
                        "cursor-pointer transition-colors hover:bg-white/[0.02] hover:text-white",
                      column.className,
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{column.header}</span>
                      {column.sortable && (
                        <span className="shrink-0 text-white/40">
                          {sortDir === "ascending" ? (
                            <ArrowUp className="text-primary h-3.5 w-3.5" />
                          ) : sortDir === "descending" ? (
                            <ArrowDown className="text-primary h-3.5 w-3.5" />
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {error ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-red-400"
                >
                  {error}
                </td>
              </tr>
            ) : loading ? (
              // Shimmer loading rows
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={`shimmer-${rIdx}`}>
                  {columns.map((col) => (
                    <td
                      key={`shimmer-${rIdx}-${col.key}`}
                      className="px-6 py-4"
                    >
                      <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-white/40"
                >
                  {emptyState || "No records found."}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={getRowKey(item, index).toString()}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "transition-colors hover:bg-white/[0.01]",
                    onRowClick && "cursor-pointer",
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-6 py-4 text-white/80",
                        column.className,
                      )}
                    >
                      {column.render
                        ? column.render(item)
                        : (item as any)[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

TableCommon.displayName = "TableCommon";
