"use client";

import Button from "@/components/atoms/button";
import { Copy } from "lucide-react";

export function OrderIdCell({
  orderId,
  onCopy,
}: {
  orderId: string;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="mt-1 flex max-w-52 items-center gap-2">
      <span className="truncate font-mono text-xs font-semibold text-content">
        {orderId}
      </span>
      <Button
        type="button"
        variant="ghost"
        aria-label={`Copy Order ${orderId}`}
        onClick={() => onCopy(orderId)}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-content/50 hover:bg-content/5 hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 h-auto p-0 active:scale-95 opacity-100 hover:opacity-100"
      >
        <Copy aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}
