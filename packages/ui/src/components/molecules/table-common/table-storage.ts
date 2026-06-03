export type TableStoredWidth = number;

const TABLE_CONFIG_STORAGE_PREFIX = "ecommerce:table-common:";
export const TABLE_DEFAULT_COLUMN_WIDTH = 180;

export const getTableConfigStorageKey = (name: string) =>
  `${TABLE_CONFIG_STORAGE_PREFIX}${name}`;

export const readStoredColumnWidths = (
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

export const writeStoredColumnWidths = (
  name: string | undefined,
  columnWidths: Record<string, TableStoredWidth>,
) => {
  if (!name || typeof window === "undefined") return;

  window.localStorage.setItem(
    getTableConfigStorageKey(name),
    JSON.stringify({ columnWidths }),
  );
};
