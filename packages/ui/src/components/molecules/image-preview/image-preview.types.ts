import React, {
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

type PreviewImageProps = ComponentPropsWithoutRef<"img"> & {
  fill?: boolean;
  unoptimized?: boolean;
  sizes?: string;
};

export interface IImagePreviewProps extends Omit<
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
  imageProps?: PreviewImageProps;
  previewImageProps?: PreviewImageProps;
  imageComponent?: React.ElementType;
}
