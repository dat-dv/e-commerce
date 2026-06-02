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
import {
  Checkbox,
  Input,
  Select,
  type Selection,
  SelectValue,
  type SortDescriptor,
  TextField,
} from "react-aria-components";

import { cn } from "../../../utils";
import {
  Button,
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "./aria-table";
import type {
  CommonTableColumn,
  CommonTableProps,
  CommonTableRef,
  TableKey,
  TableQuery,
} from "./table-common.types";
import { TableFooter } from "./table-footer";

type TableStoredWidth = number;

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
    onQueryChange,
    onRowClick,
    onEditChange,
    className,
    ...rest
  }: CommonTableProps<T>,
  ref: Ref<CommonTableRef<T>>,
) {
  const [draftData, setDraftData] = useState<T[]>(data);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [editedRows, setEditedRows] = useState<Record<string, Partial<T>>>({});
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

  const renderCell = (
    item: T,
    rowIndex: number,
    column: CommonTableColumn<T>,
  ): ReactNode => {
    const currentRowKey = getRowKey(item, rowIndex);
    const columnKey = String(column.key);
    const value = (item as Record<string, unknown>)[columnKey];

    const updateValue = (nextValue: unknown) => {
      updateRowValue(item, currentRowKey, columnKey, nextValue);

      column.onChange?.({
        item,
        value: nextValue,
        rowKey: currentRowKey,
        rowIndex,
        column,
      });
    };

    if (column.renderItem) {
      return column.renderItem({
        item,
        value,
        rowKey: currentRowKey,
        rowIndex,
        column,
        updateValue,
      });
    }

    if (column.type === "checkbox") {
      return (
        <Checkbox
          isSelected={Boolean(value)}
          onChange={(checked) => updateValue(checked)}
          className="flex cursor-pointer items-center"
        >
          <div className="border-content/20 selected:bg-primary selected:border-primary h-4 w-4 rounded border" />
        </Checkbox>
      );
    }

    if (column.type === "input" || column.type === "number") {
      const inputValue =
        typeof value === "string" || typeof value === "number" ? value : "";

      return (
        <TextField
          value={String(inputValue)}
          onChange={(nextValue) =>
            updateValue(
              column.type === "number" ? Number(nextValue) : nextValue,
            )
          }
          className="w-full"
        >
          <Input
            type={column.type === "number" ? "number" : "text"}
            className="border-content/10 bg-surface/40 focus:border-primary/50 h-9 w-full rounded-lg border px-3 outline-none"
          />
        </TextField>
      );
    }

    if (column.type === "select") {
      return (
        <Select
          selectedKey={value == null ? null : String(value)}
          onSelectionChange={(key) => updateValue(String(key))}
          className="relative w-full"
        >
          <Button className="border-content/10 bg-surface/40 focus:border-primary/50 flex h-9 w-full items-center justify-between rounded-lg border px-3 outline-none">
            <SelectValue />
          </Button>
        </Select>
      );
    }

    return value == null ? "-" : String(value);
  };

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
            items={loading ? [] : draftData}
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
            {(item) => {
              const rowIndex = draftData.indexOf(item);
              const id = getRowKey(item, rowIndex);

              return (
                <Row
                  id={id}
                  columns={tableColumns}
                  onAction={() => onRowClick?.(item, rowIndex)}
                >
                  {(column) => (
                    <Cell cellClassName={column.className}>
                      {renderCell(item, rowIndex, column)}
                    </Cell>
                  )}
                </Row>
              );
            }}
          </TableBody>
        </Table>
      )}

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
    </div>
  );
}

export const CommonTable = forwardRef(CommonTableInner) as <T extends object>(
  props: CommonTableProps<T> & {
    ref?: Ref<CommonTableRef<T>>;
  },
) => ReactNode;

export default CommonTable;
