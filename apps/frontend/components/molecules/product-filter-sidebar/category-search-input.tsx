"use client";

import { Button, Input } from "@ecommerce/ui";

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
        "border-content/[0.08] bg-content/[0.03] mb-3 flex items-center gap-2 border px-3 py-2",
        UI_RADIUS.input,
      )}
    >
      <Search className="text-content/30 h-4 w-4 shrink-0" />

      <Input
        aria-label={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        variant="none"
        size="sm"
        className="text-content placeholder:text-content/35 min-w-0 flex-1 bg-transparent text-base font-medium outline-none"
      />

      {value ? (
        <Button
          type="button"
          variant="ghost"
          onClick={() => onChange("")}
          className="text-content/35 hover:bg-content/[0.06] hover:text-content flex h-6 w-6 shrink-0 items-center justify-center rounded-md p-0"
          aria-label={clearLabel}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      ) : null}
    </div>
  );
}
