"use client";

import Button from "@/components/atoms/button";
import Input from "@/components/atoms/input";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { Search, X } from "lucide-react";

interface CategorySearchInputProps {
  value: string;
  placeholder: string;
  clearLabel: string;
  onChange: (value: string) => void;
}

export function CategorySearchInput({
  value,
  placeholder,
  clearLabel,
  onChange,
}: CategorySearchInputProps) {
  return (
    <div
      className={cn(
        "mb-3 flex items-center gap-2 border border-content/[0.08] bg-content/[0.03] px-3 py-2",
        UI_RADIUS.input,
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-content/30" />

      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        variant="none"
        size="sm"
        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-content outline-none placeholder:text-content/35"
      />

      {value ? (
        <Button
          type="button"
          variant="ghost"
          onClick={() => onChange("")}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-content/35 hover:bg-content/[0.06] hover:text-content p-0"
          aria-label={clearLabel}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      ) : null}
    </div>
  );
}
