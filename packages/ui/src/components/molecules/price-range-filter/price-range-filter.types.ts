export interface IPriceRangeFilterChange<T extends string = string> {
  minKey: T;
  maxKey: T;
  minValue: string;
  maxValue: string;
}

export interface IPriceRangeFilterLabels {
  title?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  applyLabel?: string;
  resetLabel?: string;
}

export interface IPriceRangeFilterProps<T extends string = string> {
  minKey: T;
  maxKey: T;
  minPriceValue?: string;
  maxPriceValue?: string;
  onChange: (change: IPriceRangeFilterChange<T>) => void;
  labels?: IPriceRangeFilterLabels;
  className?: string;
}
