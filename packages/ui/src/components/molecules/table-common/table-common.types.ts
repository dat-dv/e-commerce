import { type ComponentPropsWithoutRef, type ReactNode } from "react";

export type TableKey = string | number;
export type TableSortDirection = "asc" | "desc";

export type CommonTableColumnType =
  | "text"
  | "selection"
  | "checkbox"
  | "input"
  | "number"
  | "select"
  | "action";

export type TableColumnType = CommonTableColumnType;

export type TableQuery = {
  page: number;
  pageSize: number;
  search?: string;
  sortColumn?: string;
  sortDirection?: TableSortDirection;
};

export type TableSelectOption = {
  label: ReactNode;
  value: string | number | boolean;
};

export type TableColumnRenderParams<T extends object> = {
  item: T;
  value: unknown;
  rowKey: TableKey;
  rowIndex: number;
  column: CommonTableColumn<T>;
  updateValue: (value: unknown) => void;
  isExpanded: boolean;
  toggleExpanded: () => void;
};

export type TableColumnChangeParams<T extends object> = Omit<
  TableColumnRenderParams<T>,
  "updateValue"
>;

export type CommonTableColumn<T extends object> = {
  key: keyof T | string;
  header: ReactNode;
  type?: "text" | "checkbox" | "input" | "number" | "select" | "action";

  width?: number;
  minWidth?: number;
  maxWidth?: number;

  sortable?: boolean;
  resizable?: boolean;
  isRowHeader?: boolean;

  className?: string;
  headerClassName?: string;

  options?: Array<{
    label: ReactNode;
    value: string | number | boolean;
  }>;

  renderItem?: (params: TableColumnRenderParams<T>) => ReactNode;

  onChange?: (params: {
    item: T;
    value: unknown;
    rowKey: TableKey;
    rowIndex: number;
    column: CommonTableColumn<T>;
  }) => void;
};

export type CommonTableRef<T extends object> = {
  getDraftData: () => T[];
  getEditedRows: () => Record<string, Partial<T>>;
  getCheckedRows: () => T[];
  getCheckedKeys: () => Set<TableKey>;
  resetDraft: () => void;
};

export type CommonTableEditChangeParams<T extends object> = {
  item: T;
  rowKey: TableKey;
  columnKey: string;
  value: unknown;
};

export type CommonTableProps<T extends object> = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  name?: string;
  data: T[];
  columns: CommonTableColumn<T>[];
  page?: number;
  pageSize?: number;
  total?: number;
  rowKey?: (item: T, index: number) => TableKey;
  sortColumn?: string;
  sortDirection?: TableSortDirection;
  loading?: boolean;
  error?: ReactNode;
  loadingState?: ReactNode;
  errorState?: ReactNode;
  emptyState?: ReactNode;
  selectable?: boolean;
  showIndex?: boolean;
  indexHeader?: ReactNode;
  indexColumnWidth?: number;
  showPageSizeSelect?: boolean;
  pageSizeOptions?: number[];
  pageSizeLabel?: ReactNode;
  onQueryChange?: (query: TableQuery) => void;
  onRowClick?: (item: T, index: number) => void;
  onEditChange?: (params: CommonTableEditChangeParams<T>) => void;
  isRowExpandable?: (item: T, index: number) => boolean;
  renderExpandedRow?: (params: {
    item: T;
    rowKey: TableKey;
    rowIndex: number;
    isExpanded: boolean;
    toggleExpanded: () => void;
  }) => ReactNode;
};

export type ITableColumn<T extends object> = CommonTableColumn<T>;
export type ITableCommonProps<T extends object> = CommonTableProps<T>;
export type ITableSortDescriptor = {
  column: string;
  direction: "ascending" | "descending";
};
