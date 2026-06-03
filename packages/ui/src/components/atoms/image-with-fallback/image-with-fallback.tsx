"use client";

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
  useState,
} from "react";

export type ImageWithFallbackProps<T extends ElementType = "img"> = Omit<
  ComponentPropsWithoutRef<T>,
  "src" | "alt"
> & {
  src?: string | null;
  alt?: string;
  fallback?: ReactNode;
  containerClassName?: string;
  Component?: T;
};

export const ImageWithFallback = <T extends ElementType = "img">({
  src,
  alt = "",
  fallback,
  containerClassName,
  className,
  Component,
  ...props
}: ImageWithFallbackProps<T>) => {
  const [error, setError] = useState(false);
  const Comp = Component || "img";

  return (
    <div className={containerClassName}>
      {src && !error ? (
        <Comp
          src={src}
          alt={alt}
          className={className}
          onError={() => setError(true)}
          {...props}
        />
      ) : (
        fallback
      )}
    </div>
  );
};

ImageWithFallback.displayName = "ImageWithFallback";
