"use client";

import Button from "@/components/atoms/button";
import Input from "@/components/atoms/input";
import { Search, X } from "lucide-react";

export function CategorySearchInput({
  value,
  placeholder,
  clearLabel,
  onChange,
  onClear,
}: {
  value: string;
  placeholder: string;
  clearLabel: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content/25"
        aria-hidden
      />

      <Input
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl border-content/[0.06] bg-content/[0.02] pl-10 pr-10 text-sm"
      />

      {value ? (
        <Button
          type="button"
          variant="ghost"
          onClick={onClear}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-content/30 hover:bg-content/[0.06] hover:text-content p-0"
          aria-label={clearLabel}
        >
          <X className="h-4 w-4" aria-hidden />
        </Button>
      ) : null}
    </div>
  );
}
