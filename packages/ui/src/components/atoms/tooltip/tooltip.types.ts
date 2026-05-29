import { type TooltipProps as RACTooltipProps } from "react-aria-components";

export interface ITooltipProps extends Omit<RACTooltipProps, "children"> {
  content: React.ReactNode;
  children: React.ReactElement;
}
