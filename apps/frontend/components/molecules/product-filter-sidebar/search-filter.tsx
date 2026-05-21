"use client";

import Button from "@/components/atoms/button";
import Input from "@/components/atoms/input";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import { IProductSearchFilterProps } from "./product-filter-sidebar.types";

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
      <div
        className={cn(
          "flex items-center gap-2 border border-content/10 bg-content/[0.03] px-3 py-2",
          UI_RADIUS.input,
        )}
      >
        <Search size={16} className="shrink-0 text-content/35" />
        <Input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder={searchPlaceholder}
          variant="none"
          size="sm"
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-content outline-none placeholder:text-content/35"
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        size="md"
        className="w-full text-xs font-bold uppercase tracking-widest"
      >
        {t("search")}
      </Button>
    </form>
  );
}

export default ProductSearchFilter;
