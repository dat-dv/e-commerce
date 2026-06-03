import { type ReactNode } from "react";
import {
  Checkbox,
  Input,
  Select,
  SelectValue,
  TextField,
} from "react-aria-components";

import { Button } from "./aria-table";
import type { CommonTableColumn, TableKey } from "./table-common.types";

interface TableCellRendererProps<T extends object> {
  item: T;
  rowIndex: number;
  rowKey: TableKey;
  column: CommonTableColumn<T>;
  isExpanded: boolean;
  toggleExpanded: () => void;
  onUpdateValue: (value: unknown) => void;
}

export function TableCellRenderer<T extends object>({
  item,
  rowIndex,
  rowKey,
  column,
  isExpanded,
  toggleExpanded,
  onUpdateValue,
}: TableCellRendererProps<T>): ReactNode {
  const columnKey = String(column.key);
  const value = (item as Record<string, unknown>)[columnKey];

  const updateValue = (nextValue: unknown) => {
    onUpdateValue(nextValue);

    column.onChange?.({
      item,
      value: nextValue,
      rowKey,
      rowIndex,
      column,
    });
  };

  if (column.renderItem) {
    return column.renderItem({
      item,
      value,
      rowKey,
      rowIndex,
      column,
      updateValue,
      isExpanded,
      toggleExpanded,
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
          updateValue(column.type === "number" ? Number(nextValue) : nextValue)
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
}
