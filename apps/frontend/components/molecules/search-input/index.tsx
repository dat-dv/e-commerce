/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Button from "@/components/atoms/button";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { Loader2, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

export interface SearchInputProps {
  id?: string;
  value?: string | null;
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
  const [localValue, setLocalValue] = useState(value ?? "");

  const resolvedPlaceholder = placeholder || t("defaultPlaceholder");
  const resolvedClearButtonLabel = clearButtonLabel || t("clear");
  const resolvedSubmitButtonLabel = submitButtonLabel || t("submit");

  useEffect(() => {
    if (value !== localValue) setLocalValue(value ?? "");
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
        "group border-content/10 bg-content/[0.02] focus-within:border-primary/30 focus-within:bg-content/[0.04] relative flex items-center border p-1.5 transition-all duration-300 focus-within:shadow-[0_0_30px_-5px_rgba(var(--primary-rgb),0.15)]",
        UI_RADIUS.panel,
        className,
      )}
    >
      <div className="text-content/30 group-focus-within:text-primary shrink-0 pl-4 transition-colors">
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
          "text-content placeholder:text-content/30 w-full bg-transparent px-3 py-2.5 text-sm font-semibold outline-none",
          inputClassName,
        )}
      />

      <div className="flex shrink-0 items-center gap-2">
        {localValue && (
          <Button
            variant="ghost"
            onClick={handleClear}
            className={cn(
              UI_RADIUS.control,
              "bg-content/5 text-content/60 hover:bg-content/10 hover:text-content flex h-auto items-center gap-1 px-2.5 py-1 text-xs font-bold",
            )}
          >
            <X className="h-3 w-3" />
            <span>{resolvedClearButtonLabel}</span>
          </Button>
        )}

        {showSubmitButton ? (
          <Button
            variant="ghost"
            onClick={() => onSearch?.(localValue)}
            className={cn(
              UI_RADIUS.control,
              "bg-primary hover:bg-primary/90 shadow-primary/10 h-auto px-5 py-2 text-xs font-bold text-white shadow-md",
            )}
          >
            {resolvedSubmitButtonLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default SearchInput;
