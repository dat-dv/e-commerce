export interface IPriceRangeFilterChange<T extends string = string> {
  key: T;
  value: string | null;
}

export interface IPriceRangeFilterLabels {
  title?: string;
  min?: string;
  max?: string;
  apply?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

export interface IPriceRangeFilterProps<T extends string = string> {
  minKey?: T;
  maxKey?: T;
  minPriceValue?: string;
  maxPriceValue?: string;
  onFilterChange?: (changes: IPriceRangeFilterChange<T>[]) => void;
  labels?: IPriceRangeFilterLabels;
  className?: string;
}
