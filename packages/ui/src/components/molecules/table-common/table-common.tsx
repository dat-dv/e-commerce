"use client";

import {
  forwardRef,
  type ReactNode,
  type Ref,
  useImperativeHandle,
} from "react";
import { type SortDescriptor } from "react-aria-components";

import { cn } from "../../../utils";
import { Cell, Column, Row, Table, TableBody, TableHeader } from "./aria-table";
import { TableCellRenderer } from "./table-cell-renderer";
import type {
  CommonTableColumn,
  CommonTableProps,
  CommonTableRef,
  TableKey,
} from "./table-common.types";
import { TableFooter } from "./table-footer";
import { TABLE_DEFAULT_COLUMN_WIDTH } from "./table-storage";
import { useCommonTable } from "./use-common-table";

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
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

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
  const {
    draftData,
    selectedKeys,
    setSelectedKeys,
    expandedRowKeys,
    storedColumnWidths,
    getRowKey,
    emitQueryChange,
    handleSortChange,
    handlePageSizeChange,
    handleResizeEnd,
    canExpandRow,
    toggleExpandedRow,
    updateRowValue,
    getDraftData,
    getEditedRows,
    getCheckedRows,
    getCheckedKeys,
    resetDraft,
  } = useCommonTable({
    name,
    data,
    page,
    pageSize,
    rowKey,
    sortColumn,
    sortDirection,
    onQueryChange,
    onEditChange,
    renderExpandedRow,
    isRowExpandable,
  });

  useImperativeHandle(ref, () => ({
    getDraftData,
    getEditedRows,
    getCheckedRows,
    getCheckedKeys,
    resetDraft,
  }));

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
