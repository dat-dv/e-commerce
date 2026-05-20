"use client";

import {
  AppDialog,
  AppDialogPanel,
  AppDialogTitle,
} from "@/components/atoms/dialog";
import { cn } from "@/utils/cn";
import { X } from "lucide-react";
import Image, { type ImageProps } from "next/image";
import { type ButtonHTMLAttributes, type ReactNode, useState } from "react";

type ImagePreviewProps = {
  src: string;
  alt?: string;
  trigger?: ReactNode;
  triggerClassName?: string;
  thumbnailClassName?: string;
  dialogClassName?: string;
  panelClassName?: string;
  previewClassName?: string;
  imageProps?: Omit<ImageProps, "src" | "alt">;
  previewImageProps?: Omit<ImageProps, "src" | "alt">;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const isUnoptimizedImage = (src: string) =>
  src.startsWith("blob:") || src.startsWith("data:");

export default function ImagePreview({
  src,
  alt = "Preview image",
  trigger,
  triggerClassName,
  thumbnailClassName,
  dialogClassName,
  panelClassName,
  previewClassName,
  imageProps,
  previewImageProps,
  onClick,
  type = "button",
  ...buttonProps
}: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unoptimized = isUnoptimizedImage(src);

  const {
    fill: triggerFill,
    width: triggerWidth,
    height: triggerHeight,
    ...restImageProps
  } = imageProps || {};

  const {
    fill: previewFill,
    width: previewWidth,
    height: previewHeight,
    ...restPreviewImageProps
  } = previewImageProps || {};

  return (
    <>
      <button
        {...buttonProps}
        type={type}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) setIsOpen(true);
        }}
        className={cn(
          "group relative inline-flex overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          triggerClassName,
        )}
      >
        {trigger ?? (
          <Image
            src={src}
            alt={alt}
            fill={triggerFill}
            sizes="300px"
            unoptimized={unoptimized}
            {...(!triggerFill && {
              width: triggerWidth ?? 300,
              height: triggerHeight ?? 300,
            })}
            {...restImageProps}
            className={cn(
              "h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105",
              imageProps?.className,
              thumbnailClassName,
            )}
          />
        )}
      </button>

      <AppDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className={cn("bg-black/80 p-4", dialogClassName)}
      >
        <AppDialogPanel
          className={cn(
            "relative max-h-[92dvh] w-auto max-w-[94vw] bg-transparent shadow-none",
            panelClassName,
          )}
        >
          <AppDialogTitle className="sr-only">{alt}</AppDialogTitle>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute -right-3 -top-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition-colors hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="Close image preview"
          >
            <X className="size-4" aria-hidden />
          </button>

          <div className="flex max-h-[92dvh] max-w-[94vw] items-center justify-center overflow-hidden rounded-2xl">
            <Image
              src={src}
              alt={alt}
              fill={previewFill}
              sizes="94vw"
              unoptimized={unoptimized}
              {...(!previewFill && {
                width: previewWidth ?? 1600,
                height: previewHeight ?? 1200,
              })}
              {...restPreviewImageProps}
              className={cn(
                "max-h-[92dvh] w-auto max-w-[94vw] object-contain",
                previewImageProps?.className,
                previewClassName,
              )}
            />
          </div>
        </AppDialogPanel>
      </AppDialog>
    </>
  );
}
