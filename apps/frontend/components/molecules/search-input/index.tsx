"use client";

import Button from "@/components/atoms/button";
import { cn } from "@/utils/cn";
import { Loader2, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

export interface SearchInputProps {
  id?: string;
  value: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
  inputClassName?: string;
  clearButtonLabel?: string;
  submitButtonLabel?: string;
  showSubmitButton?: boolean;
  "aria-label"?: string;
}

export const SearchInput = ({
  id,
  value,
  onSearch,
  onChange,
  placeholder,
  loading = false,
  className,
  inputClassName,
  clearButtonLabel,
  submitButtonLabel,
  showSubmitButton = true,
  "aria-label": ariaLabel,
}: SearchInputProps) => {
  const t = useTranslations("Common.search");
  const [localValue, setLocalValue] = useState(value);

  const resolvedPlaceholder = placeholder || t("defaultPlaceholder");
  const resolvedClearButtonLabel = clearButtonLabel || t("clear");
  const resolvedSubmitButtonLabel = submitButtonLabel || t("submit");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    onChange?.(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (onSearch) {
        onSearch(localValue);
      }
    }
  };

  const handleClear = () => {
    setLocalValue("");
    onChange?.("");
    onSearch?.("");
  };

  return (
    <div
      className={cn(
        "group relative flex items-center rounded-2xl border border-content/10 bg-content/[0.02] p-1.5 transition-all duration-300 focus-within:border-primary/30 focus-within:bg-content/[0.04] focus-within:shadow-[0_0_30px_-5px_rgba(var(--primary-rgb),0.15)]",
        className,
      )}
    >
      <div className="pl-4 text-content/30 transition-colors group-focus-within:text-primary shrink-0">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Search className="h-5 w-5" />
        )}
      </div>

      <input
        id={id}
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={resolvedPlaceholder}
        aria-label={ariaLabel ?? resolvedPlaceholder}
        className={cn(
          "w-full bg-transparent px-3 py-2.5 text-sm font-semibold text-content outline-none placeholder:text-content/30",
          inputClassName,
        )}
      />

      <div className="flex items-center gap-2 shrink-0">
        {localValue && (
          <Button
            variant="ghost"
            onClick={handleClear}
            className="rounded-lg bg-content/5 px-2.5 py-1 text-xs font-bold text-content/60 hover:bg-content/10 hover:text-content flex items-center gap-1 h-auto"
          >
            <X className="h-3 w-3" />
            <span>{resolvedClearButtonLabel}</span>
          </Button>
        )}

        {showSubmitButton ? (
          <Button
            variant="ghost"
            onClick={() => onSearch?.(localValue)}
            className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold shadow-md shadow-primary/10 h-auto"
          >
            {resolvedSubmitButtonLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default SearchInput;
