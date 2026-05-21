"use client";

import Button from "@/components/atoms/button";
import ImagePreview from "@/components/molecules/image-preview";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div
      className={cn(
        UI_RADIUS.media,
        "relative aspect-square overflow-hidden border border-content/[0.08] bg-content/[0.03]",
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
          <ImageIcon className="h-5 w-5 text-content/30" />
        </div>
      )}
      <Button
        type="button"
        variant="ghost"
        onClick={onRemove}
        disabled={disabled}
        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50 h-auto w-auto p-0"
        aria-label={`Remove ${file.name}`}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
