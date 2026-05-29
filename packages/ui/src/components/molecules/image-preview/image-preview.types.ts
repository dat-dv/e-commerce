import { type ComponentPropsWithoutRef } from "react";

export interface IImagePreviewProps extends Omit<
  ComponentPropsWithoutRef<"img">,
  "src" | "onClick"
> {
  src: string;
  alt?: string;
  className?: string;
  previewClassName?: string;
  onRemove?: () => void;
  removeAriaLabel?: string;
}
