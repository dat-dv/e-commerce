"use client";

import { ImageWithFallback, type ImageWithFallbackProps } from "@ecommerce/ui";
import { Package } from "lucide-react";
import Image from "next/image";

export type AdminThumbnailProps = Omit<
  ImageWithFallbackProps<typeof Image>,
  "Component"
>;

export const AdminThumbnail = ({
  src,
  alt = "",
  containerClassName = "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-white/5",
  className = "object-cover",
  fallback = <Package className="h-5 w-5 text-[var(--muted)]" />,
  ...props
}: AdminThumbnailProps) => {
  return (
    <ImageWithFallback
      Component={Image}
      src={src}
      alt={alt}
      fill
      containerClassName={containerClassName}
      className={className}
      fallback={fallback}
      {...props}
    />
  );
};

AdminThumbnail.displayName = "AdminThumbnail";
