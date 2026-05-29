"use client";

import { Sparkles } from "lucide-react";
import React from "react";

import { UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import { ICategoryCardProps } from "./category-card.types";

export const CategoryCard = ({
  name,
  count,
  href = "/",
  icon: Icon = Sparkles,
  color = "text-primary",
  image,
  showCount = true,
  linkComponent: LinkComponent = "a",
  imageComponent: ImageComponent = "img",
  className,
}: ICategoryCardProps) => {
  return (
    <LinkComponent
      href={href}
      className={cn(
        UI_RADIUS.card,
        "group border-content/10 relative flex h-20 w-full items-center justify-between overflow-hidden border px-5 transition-all",
        className,
      )}
    >
      <div
        className={cn(
          "absolute top-0 right-0 h-20 w-20 bg-gradient-to-br from-current to-transparent opacity-[0.02] blur-2xl transition-opacity group-hover:opacity-[0.08]",
          color,
        )}
      />
      <div className="min-w-0 flex-1 pr-3">
        <h3 className="text-content group-hover:text-primary line-clamp-1 font-bold capitalize transition-colors">
          {name}
        </h3>
        {showCount && <p className="text-content/40 mt-0.5 text-xs">{count}</p>}
      </div>
      {image ? (
        <ImageComponent
          width={80}
          loading="eager"
          height={80}
          src={image}
          alt={name}
          className={cn(UI_RADIUS.media, "h-10 w-10 shrink-0 object-cover")}
        />
      ) : (
        <Icon
          className={cn(
            "h-5 w-5 shrink-0 opacity-30 transition-opacity group-hover:opacity-100",
            color,
          )}
        />
      )}
    </LinkComponent>
  );
};

CategoryCard.displayName = "CategoryCard";
