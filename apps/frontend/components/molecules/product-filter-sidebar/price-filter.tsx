"use client";

import { useEffect, useState } from "react";

import { IProductPriceFilterProps } from "./product-filter-sidebar.types";

export function ProductPriceFilter<T extends string = string>({
  minPriceValue,
  maxPriceValue,
  onFilterChange,
}: IProductPriceFilterProps<T>) {
  const [minPrice, setMinPrice] = useState(minPriceValue);
  const [maxPrice, setMaxPrice] = useState(maxPriceValue);

  useEffect(() => {
    if (minPriceValue === minPrice && maxPriceValue === maxPrice) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMinPrice(minPriceValue);
    setMaxPrice(maxPriceValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPriceValue, maxPriceValue]);

  const applyPriceRange = () => {
    if (onFilterChange) {
      onFilterChange([
        {
          key: "min_price" as T,
          value: minPrice || null,
        },
        {
          key: "max_price" as T,
          value: maxPrice || null,
        },
      ]);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        applyPriceRange();
      }}
      className="border-b border-content/[0.06] pb-5"
    >
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-content/45">
        Price Range
      </h3>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            className="h-10 w-full rounded-xl border border-content/10 bg-content/[0.03] px-3 text-sm font-medium text-content outline-none transition-all placeholder:text-content/35 focus:border-primary"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
          />
          <span className="text-sm font-semibold text-content/25">-</span>
          <input
            type="number"
            placeholder="Max"
            className="h-10 w-full rounded-xl border border-content/10 bg-content/[0.03] px-3 text-sm font-medium text-content outline-none transition-all placeholder:text-content/35 focus:border-primary"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </div>
        <button
          type="submit"
          className="h-10 rounded-xl border border-content/10 px-4 text-xs font-bold uppercase tracking-widest text-content/60 transition-all hover:border-primary/30 hover:text-primary active:scale-95"
        >
          Apply Price
        </button>
      </div>
    </form>
  );
}

export default ProductPriceFilter;
