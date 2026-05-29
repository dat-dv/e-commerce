import { type ButtonProps as RACButtonProps } from "react-aria-components";

import { sizeClasses, variantClasses } from "./button.style";

export type Variant = keyof typeof variantClasses;
export type Size = keyof typeof sizeClasses;

export interface IBaseProps extends RACButtonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: React.ReactNode;
  loading?: boolean;
}

export type IButtonAsLink = IBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof IBaseProps> & {
    href: string;
    ref?: React.Ref<HTMLAnchorElement>;
    disabled?: never;
    type?: never;
    linkComponent?: React.ElementType;
  };

export type IButtonAsButton = IBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof IBaseProps> & {
    href?: never;
    ref?: React.Ref<HTMLButtonElement>;
  };

export type IButtonProps = IButtonAsLink | IButtonAsButton;
