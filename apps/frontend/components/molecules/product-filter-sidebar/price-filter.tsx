"use client";

import Button from "@/components/atoms/button";
import Input from "@/components/atoms/input";
import { useEffect, useState } from "react";

import { TYPOGRAPHY } from "@/constants/typography";
import { useTranslations } from "next-intl";
import { IProductPriceFilterProps } from "./product-filter-sidebar.types";

export function ProductPriceFilter<T extends string = string>({
  minPriceValue,
  maxPriceValue,
  onFilterChange,
}: IProductPriceFilterProps<T>) {
  const t = useTranslations("ProductsPage");
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
    >
      <h3
        className={`text-content/45 mb-3 ${TYPOGRAPHY.badge} tracking-widest uppercase`}
      >
        {t("priceRange")}
      </h3>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder={t("min")}
            size="md"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
          />
          <span className="text-content/25 text-sm font-semibold">-</span>
          <Input
            type="number"
            placeholder={t("max")}
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
          {t("applyPrice")}
        </Button>
      </div>
    </form>
  );
}

export default ProductPriceFilter;
