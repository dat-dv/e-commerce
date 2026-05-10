import { sizeClasses, variantClasses } from "./button.style";

export type Variant = keyof typeof variantClasses;
export type Size = keyof typeof sizeClasses;

export type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: React.ReactNode;
  loading?: boolean;
};

export type ButtonAsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
    ref?: React.Ref<HTMLAnchorElement>;
    disabled?: never;
    type?: never;
  };

export type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: never;
    ref?: React.Ref<HTMLButtonElement>;
  };

export type ButtonProps = ButtonAsLink | ButtonAsButton;
