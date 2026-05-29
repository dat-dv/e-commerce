"use client";

import { X } from "lucide-react";
import React, {
  type ButtonHTMLAttributes,
  type ReactNode,
  useState,
} from "react";
import { cn } from "../../../utils";
import { AppDialog, AppDialogPanel, AppDialogTitle } from "../../atoms/dialog";

export interface ImagePreviewProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  src: string;
  alt?: string;
  trigger?: ReactNode;
  triggerClassName?: string;
  thumbnailClassName?: string;
  dialogClassName?: string;
  panelClassName?: string;
  previewClassName?: string;
  imageProps?: Record<string, any>;
  previewImageProps?: Record<string, any>;
  imageComponent?: React.ElementType;
}

const isUnoptimizedImage = (src: string) =>
  src.startsWith("blob:") || src.startsWith("data:");

export function ImagePreview({
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
  imageComponent: ImgComponent = "img",
  ...buttonProps
}: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unoptimized = isUnoptimizedImage(src);

  const {
    fill: triggerFill,
    width: triggerWidth,
    height: triggerHeight,
    className: triggerImgClassName,
    ...restImageProps
  } = imageProps || {};

  const {
    fill: previewFill,
    width: previewWidth,
    height: previewHeight,
    className: previewImgClassName,
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
          "group focus-visible:ring-primary/40 relative inline-flex overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:outline-none",
          triggerClassName,
        )}
      >
        {trigger ?? (
          <ImgComponent
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
              triggerImgClassName,
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
            className="absolute -top-3 -right-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition-colors hover:bg-black/85 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
            aria-label="Close image preview"
          >
            <X className="size-4" aria-hidden />
          </button>

          <div className="relative h-[70vh] w-[90vw] overflow-hidden rounded-2xl sm:h-[80vh] md:w-[80vw]">
            <ImgComponent
              src={src}
              alt={alt}
              fill={previewFill ?? true}
              sizes="(max-width: 768px) 90vw, 80vw"
              unoptimized={unoptimized}
              {...(!(previewFill ?? true) && {
                width: previewWidth ?? 1600,
                height: previewHeight ?? 1200,
              })}
              {...restPreviewImageProps}
              className={cn(
                "object-contain",
                previewImgClassName,
                previewClassName,
              )}
            />
          </div>
        </AppDialogPanel>
      </AppDialog>
    </>
  );
}

export default ImagePreview;
