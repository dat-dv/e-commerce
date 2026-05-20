"use client";

import {
  AppDialog,
  AppDialogPanel,
  AppDialogTitle,
} from "@/components/atoms/dialog";
import { cn } from "@/utils/cn";
import { X } from "lucide-react";
import Image from "next/image";
import { type ComponentPropsWithoutRef, type ReactNode, useState } from "react";

interface ImagePreviewProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "children"
> {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  children?: ReactNode;
  imageClassName?: string;
  triggerClassName?: string;
  dialogClassName?: string;
  panelClassName?: string;
  previewImageClassName?: string;
}

const shouldUseUnoptimizedImage = (src: string) =>
  src.startsWith("blob:") || src.startsWith("data:");

export default function ImagePreview({
  src,
  alt = "Preview image",
  width = 300,
  height = 300,
  fill = false,
  sizes,
  children,
  className,
  imageClassName,
  triggerClassName,
  dialogClassName,
  panelClassName,
  previewImageClassName,
  type = "button",
  ...props
}: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unoptimized = shouldUseUnoptimizedImage(src);

  return (
    <>
      <button
        type={type}
        onClick={() => setIsOpen(true)}
        className={cn(
          "group relative block overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          triggerClassName,
          className,
        )}
        {...props}
      >
        {children ??
          (fill ? (
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              unoptimized={unoptimized}
              className={cn(
                "object-cover transition-transform duration-300 group-hover:scale-105",
                imageClassName,
              )}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes={sizes}
              unoptimized={unoptimized}
              className={cn(
                "h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105",
                imageClassName,
              )}
            />
          ))}
      </button>

      <AppDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className={cn("bg-black/75 p-3 sm:p-4", dialogClassName)}
      >
        <AppDialogPanel
          className={cn(
            "relative w-auto max-w-[94vw] overflow-visible rounded-2xl bg-transparent shadow-none sm:max-w-[90vw]",
            panelClassName,
          )}
        >
          <AppDialogTitle className="sr-only">{alt}</AppDialogTitle>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-2 top-2 z-10 flex size-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="Close image preview"
          >
            <X className="size-4" aria-hidden />
          </button>

          <div className="relative max-h-[90vh] max-w-[94vw] overflow-hidden rounded-2xl bg-black/20 sm:max-w-[90vw]">
            <Image
              src={src}
              alt={alt}
              width={1400}
              height={1400}
              sizes="90vw"
              unoptimized={unoptimized}
              className={cn(
                "h-auto max-h-[90vh] w-auto max-w-[94vw] object-contain sm:max-w-[90vw]",
                previewImageClassName,
              )}
            />
          </div>
        </AppDialogPanel>
      </AppDialog>
    </>
  );
}
