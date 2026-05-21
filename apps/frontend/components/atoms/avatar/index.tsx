import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";

const Avatar = ({
  url,
  name,
  size = 80,
}: {
  url?: string;
  name?: string;
  size?: number;
}) => {
  const t = useTranslations("Common.avatar");

  return url ? (
    <Image
      width={size}
      height={size}
      loading="eager"
      src={url}
      alt={t("alt")}
      className="object-cover"
    />
  ) : (
    <div className="bg-primary/10 flex h-full w-full items-center justify-center">
      <span
        className="text-primary font-bold"
        style={{ fontSize: `${size * 0.4}px` }}
      >
        {name?.charAt(0) || "U"}
      </span>
    </div>
  );
};

export default Avatar;
