export interface IAppliedFiltersBarProps<T extends string = string> {
  chips?: { key: T; label: string }[];
  onClearFilter: (key: T) => void;
  onResetFilters: () => void;
  appliedLabel?: string;
  resetAllLabel?: string;
  className?: string;
}
