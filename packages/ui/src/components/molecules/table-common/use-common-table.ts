import { type Key as ReactKey, useEffect, useState } from "react";
import type { Selection, SortDescriptor } from "react-aria-components";

import type {
  CommonTableProps,
  TableKey,
  TableQuery,
} from "./table-common.types";
import {
  readStoredColumnWidths,
  type TableStoredWidth,
  writeStoredColumnWidths,
} from "./table-storage";

export function useCommonTable<T extends object>({
  name,
  data,
  page = 1,
  pageSize = data.length || 10,
  rowKey,
  sortColumn,
  sortDirection,
  onQueryChange,
  onEditChange,
  renderExpandedRow,
  isRowExpandable,
}: Pick<
  CommonTableProps<T>,
  | "name"
  | "data"
  | "page"
  | "pageSize"
  | "rowKey"
  | "sortColumn"
  | "sortDirection"
  | "onQueryChange"
  | "onEditChange"
  | "renderExpandedRow"
  | "isRowExpandable"
>) {
  const [draftData, setDraftData] = useState<T[]>(data);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [editedRows, setEditedRows] = useState<Record<string, Partial<T>>>({});
  const [expandedRowKeys, setExpandedRowKeys] = useState<Set<TableKey>>(
    () => new Set(),
  );
  const [storedColumnWidths, setStoredColumnWidths] = useState(() =>
    readStoredColumnWidths(name),
  );

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

  const toggleExpandedRow = (key: TableKey) => {
    setExpandedRowKeys((prev) => {
      const next = new Set(prev);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
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

  const getDraftData = () => draftData;
  const getEditedRows = () => editedRows;
  const getCheckedRows = () => {
    if (selectedKeys === "all") return draftData;
    return draftData.filter((item, index) =>
      selectedKeys.has(getRowKey(item, index)),
    );
  };
  const getCheckedKeys = () =>
    selectedKeys === "all" ? new Set<TableKey>() : selectedKeys;
  const resetDraft = () => {
    setDraftData(data);
    setEditedRows({});
    setSelectedKeys(new Set());
  };

  return {
    draftData,
    setDraftData,
    selectedKeys,
    setSelectedKeys,
    editedRows,
    setEditedRows,
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
  };
}
