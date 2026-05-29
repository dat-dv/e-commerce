"use client";

import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { Button, ImagePreview } from "@ecommerce/ui";
import { ImageIcon, X } from "lucide-react";
import { useEffect, useState } from "react";

export const AttachmentPreview = ({
  file,
  onRemove,
  disabled,
}: {
  file: File;
  onRemove: () => void;
  disabled: boolean;
}) => {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div
      className={cn(
        UI_RADIUS.media,
        "border-content/[0.08] bg-content/[0.03] relative aspect-square overflow-hidden border",
      )}
    >
      {previewUrl ? (
        <ImagePreview
          src={previewUrl}
          alt={file.name}
          triggerClassName={cn(UI_RADIUS.media, "absolute inset-0")}
          imageProps={{
            fill: true,
            sizes: "88px",
            className: "object-cover",
          }}
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <ImageIcon className="text-content/30 h-5 w-5" />
        </div>
      )}
      <Button
        type="button"
        variant="ghost"
        onClick={onRemove}
        disabled={disabled}
        className="absolute top-1.5 right-1.5 flex h-7 h-auto w-7 w-auto items-center justify-center rounded-full bg-black/70 p-0 text-white transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50"
        aria-label={`Remove ${file.name}`}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
