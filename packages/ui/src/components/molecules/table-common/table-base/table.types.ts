import {
  type CellProps,
  type ColumnProps,
  type RowProps,
  type TableBodyProps,
  type TableHeaderProps,
  type TableProps,
} from "react-aria-components";

export interface ICommonTableProps extends Omit<TableProps, "className"> {
  className?: string;
}

export interface ICommonTableHeaderProps<T extends object> extends Omit<
  TableHeaderProps<T>,
  "className"
> {
  className?: string;
}

export interface ICommonColumnProps extends Omit<ColumnProps, "className"> {
  className?: string;
}

export interface ICommonTableBodyProps<T extends object> extends Omit<
  TableBodyProps<T>,
  "className"
> {
  className?: string;
}

export interface ICommonRowProps<T extends object> extends Omit<
  RowProps<T>,
  "className"
> {
  className?: string;
}

export interface ICommonCellProps extends Omit<CellProps, "className"> {
  className?: string;
}
