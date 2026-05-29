"use client";

import Button from "@/components/atoms/button";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { Upload } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";

import { AttachmentPreview } from "./attachment-preview";
import {
  ORDER_RETURN_ALLOWED_IMAGE_TYPES,
  ORDER_RETURN_MAX_ATTACHMENTS,
} from "./request-return.constants";

export function AttachmentDropzone({
  attachments,
  disabled,
  fileInputRef,
  labels,
  onAttachmentChange,
  onRemoveAttachment,
}: {
  attachments: File[];
  disabled: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  labels: {
    evidence: string;
    upload: string;
    photoRequired: string;
  };
  onAttachmentChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (index: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-content/45 block text-xs font-bold tracking-wide uppercase">
          {labels.evidence}
        </label>
        <span className="text-content/35 text-xs font-semibold">
          {attachments.length}/{ORDER_RETURN_MAX_ATTACHMENTS}
        </span>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={ORDER_RETURN_ALLOWED_IMAGE_TYPES.join(",")}
        multiple
        onChange={onAttachmentChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={
          disabled || attachments.length >= ORDER_RETURN_MAX_ATTACHMENTS
        }
        className={cn(
          UI_RADIUS.control,
          "border-content/[0.14] bg-content/[0.02] text-content/60 hover:border-primary/30 hover:bg-primary/[0.04] flex h-auto w-full items-center justify-center gap-2 border-dashed px-4 py-4 text-sm font-semibold disabled:opacity-50",
        )}
      >
        <Upload className="h-4 w-4" />
        {labels.upload}
      </Button>

      {attachments.length ? (
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {attachments.map((file, index) => (
            <AttachmentPreview
              key={`${file.name}-${file.lastModified}`}
              file={file}
              disabled={disabled}
              onRemove={() => onRemoveAttachment(index)}
            />
          ))}
        </div>
      ) : (
        <p className="text-content/35 mt-2 text-xs font-medium">
          {labels.photoRequired}
        </p>
      )}
    </div>
  );
}
