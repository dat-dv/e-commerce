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
      <span className="text-content truncate font-mono text-xs font-semibold">
        {orderId}
      </span>
      <Button
        type="button"
        variant="ghost"
        aria-label={`Copy Order ${orderId}`}
        onClick={() => onCopy(orderId)}
        className="text-content/50 hover:bg-content/5 hover:text-content focus-visible:ring-primary/40 inline-flex size-8 h-auto shrink-0 items-center justify-center rounded-md p-0 opacity-100 hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none active:scale-95"
      >
        <Copy aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}
