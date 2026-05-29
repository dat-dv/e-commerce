import React from "react";

export interface AvatarProps {
  url?: string;
  name?: string;
  size?: number;
  alt?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  url,
  name,
  size = 80,
  alt = "Avatar",
  className,
}) => {
  return url ? (
    <img
      width={size}
      height={size}
      loading="eager"
      src={url}
      alt={alt}
      className={className || "object-cover"}
    />
  ) : (
    <div className="bg-primary/10 flex h-full w-full items-center justify-center">
      <span
        className="text-primary font-bold"
        style={{ fontSize: `${size * 0.3}px` }}
      >
        {name?.charAt(0) || "U"}
      </span>
    </div>
  );
};

export default Avatar;
