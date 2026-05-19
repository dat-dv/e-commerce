"use client";

import Button from "@/components/atoms/button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { IProductSearchFilterProps } from "./product-filter-sidebar.types";

import { useTranslations } from "next-intl";

export function ProductSearchFilter({
  show,
  onSearchSubmit,
  searchPlaceholder,
  initialSearchValue,
}: IProductSearchFilterProps) {
  const t = useTranslations("ProductsPage");
  const [searchValue, setSearchValue] = useState(initialSearchValue);

  useEffect(() => {
    if (initialSearchValue === searchValue) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchValue(initialSearchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearchValue]);

  if (!show) return null;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!onSearchSubmit) return;
        onSearchSubmit(searchValue); // Fixed bug where initialSearchValue was submitted instead of searchValue
      }}
      className="flex flex-col gap-3 border-b border-content/[0.06] pb-5"
    >
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-content/45">
        {t("search")}
      </h3>
      <div className="flex items-center gap-2 rounded-xl border border-content/10 bg-content/[0.03] px-3 py-2">
        <Search size={16} className="shrink-0 text-content/35" />
        <input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder={searchPlaceholder}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-content outline-none placeholder:text-content/35"
        />
      </div>
      <Button
        type="submit"
        className="h-10 rounded-xl bg-primary px-4 text-xs font-bold uppercase tracking-widest text-white"
      >
        {t("search")}
      </Button>
    </form>
  );
}

export default ProductSearchFilter;
