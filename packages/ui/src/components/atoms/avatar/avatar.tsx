"use client";

import { cn } from "../../../utils";
import { type IAvatarProps } from "./avatar.types";

export const Avatar = ({
  url,
  name,
  size = 80,
  alt = "Avatar",
  className,
  style,
  ...rest
}: IAvatarProps) => {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full",
        className,
      )}
      style={{ width: size, height: size, ...style }}
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
          className="text-primary font-bold"
          style={{ fontSize: `${size * 0.35}px` }}
          aria-label={name ?? "User"}
        >
          {name?.charAt(0)?.toUpperCase() ?? "U"}
        </span>
      )}
    </div>
  );
};

Avatar.displayName = "Avatar";

export default Avatar;
