"use client";

import { cn } from "../../../utils";
import { type IAvatarProps } from "./avatar.types";

export const Avatar = ({
  url,
  name,
  size,
  alt = "Avatar",
  className,
  style,
  ...rest
}: IAvatarProps) => {
  const sizeStyle = size !== undefined ? { width: size, height: size } : {};

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full",
        size === undefined && "h-full w-full",
        className,
      )}
      style={{ ...sizeStyle, ...style }}
      {...rest}
    >
      {url ? (
        <img
          src={url}
          alt={alt}
          width={size}
          height={size}
          loading="eager"
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className="text-primary leading-none font-bold"
          style={
            size !== undefined
              ? { fontSize: `${size * 0.35}px` }
              : { fontSize: "1rem" }
          }
          aria-label={name ?? "User"}
        >
          {name?.charAt(0)?.toUpperCase() ?? "U"}
        </span>
      )}
    </div>
  );
};

Avatar.displayName = "Avatar";
