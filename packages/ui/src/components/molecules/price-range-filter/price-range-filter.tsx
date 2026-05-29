"use client";

import { useEffect, useState } from "react";

import { TYPOGRAPHY } from "../../../tokens";
import { Button } from "../../atoms/button";
import { Input } from "../../atoms/input";
import { IPriceRangeFilterProps } from "./price-range-filter.types";

export function PriceRangeFilter<T extends string = string>({
  minPriceValue = "",
  maxPriceValue = "",
  onFilterChange,
  labels,
  minKey = "min_price" as T,
  maxKey = "max_price" as T,
}: IPriceRangeFilterProps<T>) {
  const [minPrice, setMinPrice] = useState(minPriceValue);
  const [maxPrice, setMaxPrice] = useState(maxPriceValue);

  useEffect(() => {
    if (minPriceValue === minPrice && maxPriceValue === maxPrice) return;
    setMinPrice(minPriceValue);
    setMaxPrice(maxPriceValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPriceValue, maxPriceValue]);

  const applyPriceRange = () => {
    onFilterChange?.([
      {
        key: minKey,
        value: minPrice || null,
      },
      {
        key: maxKey,
        value: maxPrice || null,
      },
    ]);
  };

  const title = labels?.title ?? "Price range";
  const minLabel = labels?.min ?? "Min";
  const maxLabel = labels?.max ?? "Max";
  const applyLabel = labels?.apply ?? "Apply";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        applyPriceRange();
      }}
    >
      <h3
        className={`text-content/45 mb-3 ${TYPOGRAPHY.badge} tracking-widest uppercase`}
      >
        {title}
      </h3>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Input
            aria-label={minLabel}
            type="number"
            placeholder={minLabel}
            size="md"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
          />
          <span className="text-content/25 text-sm font-semibold">-</span>
          <Input
            aria-label={maxLabel}
            type="number"
            placeholder={maxLabel}
            size="md"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          size="md"
          className="w-full text-xs font-bold tracking-widest uppercase"
        >
          {applyLabel}
        </Button>
      </div>
    </form>
  );
}

PriceRangeFilter.displayName = "PriceRangeFilter";
