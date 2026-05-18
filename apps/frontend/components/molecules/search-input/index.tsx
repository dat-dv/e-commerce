"use client";

import React, { useState } from "react";
import { Search, Loader2, X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface SearchInputProps {
  value: string;
  onSearch?: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
  inputClassName?: string;
  submitButtonLabel?: string;
}

export const SearchInput = ({
  value,
  onSearch,
  placeholder = "Search...",
  loading = false,
  className,
  inputClassName,
  submitButtonLabel = "Search",
}: SearchInputProps) => {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
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
    if (onSearch) {
      onSearch("");
    }
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
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "w-full bg-transparent px-3 py-2.5 text-sm font-semibold text-content outline-none placeholder:text-content/30",
          inputClassName,
        )}
      />

      <div className="flex items-center gap-2 shrink-0">
        {localValue && (
          <button
            onClick={handleClear}
            className="rounded-lg bg-content/5 px-2.5 py-1 text-xs font-bold text-content/60 transition-colors hover:bg-content/10 hover:text-content flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            <span>Clear</span>
          </button>
        )}

        <button
          onClick={() => onSearch?.(localValue)}
          className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-primary/10"
        >
          {submitButtonLabel}
        </button>
      </div>
    </div>
  );
};

export default SearchInput;
