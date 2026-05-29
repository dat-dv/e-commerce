"use client";

import { Loader2, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import { UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import { Button } from "../../atoms/button";
import { ISearchInputProps } from "./search-input.types";

export const SearchInput = ({
  id,
  value,
  onSearch,
  onChange,
  placeholder = "Search...",
  loading = false,
  className,
  inputClassName,
  clearButtonLabel = "Clear",
  submitButtonLabel = "Submit",
  showSubmitButton = true,
  "aria-label": ariaLabel,
}: ISearchInputProps) => {
  const [localValue, setLocalValue] = useState(value ?? "");

  useEffect(() => {
    if (value !== localValue) setLocalValue(value ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
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
            <span>{clearButtonLabel}</span>
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
            {submitButtonLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

SearchInput.displayName = "SearchInput";

export default SearchInput;
