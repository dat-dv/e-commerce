import type { TableSortDirection } from "@ecommerce/ui";

export type TableSortFieldMap<T> = Partial<Record<string, T>>;

export type TableSortValueMap<T> = Partial<
  Record<string, Partial<Record<TableSortDirection, T>>>
>;

export const getTableSortField = <T>(
  column: string | undefined,
  direction: TableSortDirection | undefined,
  fieldMap: TableSortFieldMap<T>,
) => {
  const field = column ? fieldMap[column] : undefined;

  return field && direction ? { field, direction } : null;
};

export const getTableSortValue = <T>(
  column: string | undefined,
  direction: TableSortDirection | undefined,
  valueMap: TableSortValueMap<T>,
) => {
  if (!column || !direction) return null;

  return valueMap[column]?.[direction] ?? null;
};
