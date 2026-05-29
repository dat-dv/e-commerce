import { type DialogProps, type HeadingProps } from "react-aria-components";

export interface IAppDialogProps {
  children: React.ReactNode;
  className?: string;
  isDismissable?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export interface IAppDialogPanelProps extends DialogProps {
  children: React.ReactNode;
  className?: string;
}

export interface IAppDialogTitleProps extends HeadingProps {
  as?: React.ElementType;
  children: React.ReactNode;
}
