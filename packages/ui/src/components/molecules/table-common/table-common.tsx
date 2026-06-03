"use client";

import {
  forwardRef,
  type Key as ReactKey,
  type ReactNode,
  type Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { type Selection, type SortDescriptor } from "react-aria-components";

import { cn } from "../../../utils";
import { Cell, Column, Row, Table, TableBody, TableHeader } from "./aria-table";
import { TableCellRenderer } from "./table-cell-renderer";
import type {
  CommonTableColumn,
  CommonTableProps,
  CommonTableRef,
  TableKey,
  TableQuery,
} from "./table-common.types";
import { TableFooter } from "./table-footer";

type TableStoredWidth = number;
type TableRenderRow<T extends object> =
  | {
      id: string;
      item: T;
      kind: "data";
      rowIndex: number;
      rowKey: TableKey;
    }
  | {
      id: string;
      item: T;
      kind: "expanded";
      rowIndex: number;
      rowKey: TableKey;
    };

const TABLE_INDEX_COLUMN_KEY = "__table_index__";
const TABLE_CONFIG_STORAGE_PREFIX = "ecommerce:table-common:";
const TABLE_DEFAULT_COLUMN_WIDTH = 180;
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const getTableConfigStorageKey = (name: string) =>
  `${TABLE_CONFIG_STORAGE_PREFIX}${name}`;

const readStoredColumnWidths = (
  name?: string,
): Record<string, TableStoredWidth> => {
  if (!name || typeof window === "undefined") return {};

  try {
    const rawValue = window.localStorage.getItem(
      getTableConfigStorageKey(name),
    );
    if (!rawValue) return {};

    const parsed = JSON.parse(rawValue) as unknown;
    if (!parsed || typeof parsed !== "object") return {};

    const widths = (parsed as { columnWidths?: unknown }).columnWidths;
    if (!widths || typeof widths !== "object") return {};

    return Object.entries(widths as Record<string, unknown>).reduce<
      Record<string, TableStoredWidth>
    >((acc, [columnKey, width]) => {
      if (typeof width === "number") {
        acc[columnKey] = width;
      }

      return acc;
    }, {});
  } catch {
    return {};
  }
};

const writeStoredColumnWidths = (
  name: string | undefined,
  columnWidths: Record<string, TableStoredWidth>,
) => {
  if (!name || typeof window === "undefined") return;

  window.localStorage.setItem(
    getTableConfigStorageKey(name),
    JSON.stringify({ columnWidths }),
  );
};

function CommonTableInner<T extends object>(
  {
    name,
    data,
    columns,
    page = 1,
    pageSize = data.length || 10,
    total = data.length,
    rowKey,
    sortColumn,
    sortDirection,
    loading = false,
    error = null,
    emptyState = "No records found.",
    selectable = false,
    showIndex = false,
    indexHeader = "STT",
    indexColumnWidth = 72,
    showPageSizeSelect = true,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    pageSizeLabel = "Rows per page",
    showFooter = true,
    onQueryChange,
    onRowClick,
    onEditChange,
    isRowExpandable,
    renderExpandedRow,
    className,
    ...rest
  }: CommonTableProps<T>,
  ref: Ref<CommonTableRef<T>>,
) {
  const [draftData, setDraftData] = useState<T[]>(data);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [editedRows, setEditedRows] = useState<Record<string, Partial<T>>>({});
  const [expandedRowKeys, setExpandedRowKeys] = useState<Set<TableKey>>(
    () => new Set(),
  );
  const [storedColumnWidths, setStoredColumnWidths] = useState(() =>
    readStoredColumnWidths(name),
  );
  const tableColumns: CommonTableColumn<T>[] = showIndex
    ? [
        {
          key: TABLE_INDEX_COLUMN_KEY,
          header: indexHeader,
          width: indexColumnWidth,
          minWidth: 48,
          maxWidth: 140,
          resizable: true,
          isRowHeader: false,
          className: "text-center",
          headerClassName: "text-center justify-center",
          renderItem: ({ rowIndex }) =>
            (Math.max(page, 1) - 1) * pageSize + rowIndex + 1,
        },
        ...columns,
      ]
    : columns;
  const rowHeaderColumnKey =
    tableColumns.find((column) => column.isRowHeader)?.key ??
    tableColumns.find((column) => String(column.key) !== TABLE_INDEX_COLUMN_KEY)
      ?.key ??
    tableColumns[0]?.key;
  const tableMinWidth = tableColumns.reduce((totalWidth, column) => {
    const columnKey = String(column.key);
    return (
      totalWidth +
      (storedColumnWidths[columnKey] ??
        column.width ??
        column.minWidth ??
        TABLE_DEFAULT_COLUMN_WIDTH)
    );
  }, 0);

  useEffect(() => {
    setDraftData(data);
  }, [data]);

  useEffect(() => {
    setStoredColumnWidths(readStoredColumnWidths(name));
  }, [name]);

  const getRowKey = (item: T, index: number): TableKey => {
    if (rowKey) return rowKey(item, index);

    const itemRecord = item as Record<string, unknown>;
    const fallbackKey = itemRecord.id ?? itemRecord.key;

    return typeof fallbackKey === "string" || typeof fallbackKey === "number"
      ? fallbackKey
      : index;
  };

  const emitQueryChange = (nextQuery: Partial<TableQuery>) => {
    onQueryChange?.({
      page,
      pageSize,
      sortColumn,
      sortDirection,
      ...nextQuery,
    });
  };

  const handleSortChange = (descriptor: SortDescriptor) => {
    emitQueryChange({
      page: 1,
      sortColumn: String(descriptor.column),
      sortDirection: descriptor.direction === "ascending" ? "asc" : "desc",
    });
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    emitQueryChange({
      page: 1,
      pageSize: nextPageSize,
    });
  };

  const handleResizeEnd = (widths: Map<ReactKey, unknown>) => {
    if (!name) return;

    const nextColumnWidths = Array.from(widths.entries()).reduce<
      Record<string, TableStoredWidth>
    >((acc, [columnKey, width]) => {
      if (typeof width === "number") {
        acc[String(columnKey)] = width;
      }

      return acc;
    }, {});

    setStoredColumnWidths(nextColumnWidths);
    writeStoredColumnWidths(name, nextColumnWidths);
  };

  const canExpandRow = (item: T, index: number) =>
    Boolean(renderExpandedRow) && (isRowExpandable?.(item, index) ?? true);

  const toggleExpandedRow = (rowKey: TableKey) => {
    setExpandedRowKeys((prev) => {
      const next = new Set(prev);

      if (next.has(rowKey)) {
        next.delete(rowKey);
      } else {
        next.add(rowKey);
      }

      return next;
    });
  };

  const updateRowValue = (
    item: T,
    currentRowKey: TableKey,
    columnKey: string,
    value: unknown,
  ) => {
    setDraftData((prev) =>
      prev.map((row, index) =>
        getRowKey(row, index) === currentRowKey
          ? { ...row, [columnKey]: value }
          : row,
      ),
    );

    setEditedRows((prev) => ({
      ...prev,
      [String(currentRowKey)]: {
        ...prev[String(currentRowKey)],
        [columnKey]: value,
      } as Partial<T>,
    }));

    onEditChange?.({
      item,
      rowKey: currentRowKey,
      columnKey,
      value,
    });
  };

  useImperativeHandle(ref, () => ({
    getDraftData: () => draftData,
    getEditedRows: () => editedRows,
    getCheckedRows: () => {
      if (selectedKeys === "all") return draftData;

      return draftData.filter((item, index) =>
        selectedKeys.has(getRowKey(item, index)),
      );
    },
    getCheckedKeys: () =>
      selectedKeys === "all" ? new Set<TableKey>() : selectedKeys,
    resetDraft: () => {
      setDraftData(data);
      setEditedRows({});
      setSelectedKeys(new Set());
    },
  }));

  const sortDescriptor: SortDescriptor | undefined = sortColumn
    ? {
        column: sortColumn,
        direction: sortDirection === "desc" ? "descending" : "ascending",
      }
    : undefined;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageSizeSelectOptions = pageSizeOptions.includes(pageSize)
    ? pageSizeOptions
    : [pageSize, ...pageSizeOptions].sort((a, b) => a - b);
  const tableRows: TableRenderRow<T>[] = loading
    ? []
    : draftData.flatMap((item, rowIndex) => {
        const rowKey = getRowKey(item, rowIndex);
        const id = String(rowKey);
        const rows: TableRenderRow<T>[] = [
          {
            id,
            item,
            kind: "data",
            rowIndex,
            rowKey,
          },
        ];

        if (expandedRowKeys.has(rowKey) && canExpandRow(item, rowIndex)) {
          rows.push({
            id: `${id}__expanded`,
            item,
            kind: "expanded",
            rowIndex,
            rowKey,
          });
        }

        return rows;
      });

  return (
    <div
      className={cn(
        "border-content/10 bg-surface/30 w-full overflow-hidden rounded-xl border shadow-xl backdrop-blur-xl",
        className,
      )}
      {...rest}
    >
      {error ? (
        <div className="px-6 py-12 text-center text-red-400">{error}</div>
      ) : (
        <Table
          aria-label="Common table"
          {...(selectable
            ? {
                selectionMode: "multiple" as const,
                selectedKeys,
                onSelectionChange: setSelectedKeys,
              }
            : {})}
          sortDescriptor={sortDescriptor}
          onSortChange={handleSortChange}
          onResizeEnd={handleResizeEnd}
          tableMinWidth={tableMinWidth}
        >
          <TableHeader columns={tableColumns}>
            {(column) => {
              const columnKey = String(column.key);

              return (
                <Column
                  id={columnKey}
                  allowsSorting={column.sortable}
                  isRowHeader={
                    column.isRowHeader ??
                    String(rowHeaderColumnKey) === columnKey
                  }
                  defaultWidth={storedColumnWidths[columnKey] ?? column.width}
                  minWidth={column.minWidth}
                  maxWidth={column.maxWidth}
                  isResizable={column.resizable}
                  headerClassName={column.headerClassName}
                >
                  {column.header}
                </Column>
              );
            }}
          </TableHeader>

          <TableBody
            items={tableRows}
            renderEmptyState={() => (
              <div className="px-6 py-12 text-center opacity-50">
                {loading ? (
                  <div className="flex h-[500px] items-center justify-center">
                    <div className="bg-content/10 h-1.5 w-[200px] animate-pulse rounded-full" />
                  </div>
                ) : (
                  emptyState
                )}
              </div>
            )}
          >
            {(tableRow) => {
              const { item, rowIndex, rowKey } = tableRow;
              const isExpanded = expandedRowKeys.has(rowKey);
              const rowCanExpand = canExpandRow(item, rowIndex);
              const toggleExpanded = () => toggleExpandedRow(rowKey);

              if (tableRow.kind === "expanded" && renderExpandedRow) {
                return (
                  <Row id={tableRow.id}>
                    <Cell
                      colSpan={tableColumns.length + (selectable ? 1 : 0)}
                      cellClassName="bg-content/[0.015] px-0 py-0"
                    >
                      {renderExpandedRow({
                        item,
                        rowKey,
                        rowIndex,
                        isExpanded,
                        toggleExpanded,
                      })}
                    </Cell>
                  </Row>
                );
              }

              return (
                <Row
                  id={tableRow.id}
                  columns={tableColumns}
                  onAction={() => {
                    if (onRowClick) {
                      onRowClick(item, rowIndex);
                      return;
                    }

                    if (rowCanExpand) {
                      toggleExpanded();
                    }
                  }}
                >
                  {(column) => (
                    <Cell cellClassName={column.className}>
                      <TableCellRenderer
                        item={item}
                        rowIndex={rowIndex}
                        rowKey={rowKey}
                        column={column}
                        isExpanded={isExpanded}
                        toggleExpanded={toggleExpanded}
                        onUpdateValue={(value) =>
                          updateRowValue(
                            item,
                            rowKey,
                            String(column.key),
                            value,
                          )
                        }
                      />
                    </Cell>
                  )}
                </Row>
              );
            }}
          </TableBody>
        </Table>
      )}

      {showFooter && (
        <TableFooter
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          pageSizeLabel={pageSizeLabel}
          pageSizeOptions={pageSizeSelectOptions}
          showPageSizeSelect={showPageSizeSelect}
          onPageChange={(nextPage) => emitQueryChange({ page: nextPage })}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}

export const CommonTable = forwardRef(CommonTableInner) as <T extends object>(
  props: CommonTableProps<T> & {
    ref?: Ref<CommonTableRef<T>>;
  },
) => ReactNode;

export default CommonTable;
