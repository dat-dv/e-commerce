import { type ReactNode } from "react";

export interface ITableColumn<T> {
  key: string;
  header: ReactNode;
  sortable?: boolean;
  className?: string;
  render?: (item: T) => ReactNode;
}

export interface ITableSortDescriptor {
  column: string;
  direction: "ascending" | "descending";
}

export interface ITableCommonProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ITableColumn<T>[];
  loading?: boolean;
  error?: string | null;
  sortDescriptor?: ITableSortDescriptor;
  onSortChange?: (sortDescriptor: ITableSortDescriptor) => void;
  onRowClick?: (item: T) => void;
  className?: string;
  emptyState?: ReactNode;
  rowKey?: (item: T) => string | number;
}
