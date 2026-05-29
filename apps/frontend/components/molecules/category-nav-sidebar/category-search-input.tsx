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
        className="text-content/25 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
        aria-hidden
      />

      <Input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        size="md"
        className="border-content/[0.06] bg-content/[0.02] pr-10 pl-10"
      />

      {value ? (
        <Button
          type="button"
          variant="ghost"
          onClick={onClear}
          className="text-content/30 hover:bg-content/[0.06] hover:text-content absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg p-0"
          aria-label={clearLabel}
        >
          <X className="h-4 w-4" aria-hidden />
        </Button>
      ) : null}
    </div>
  );
}
