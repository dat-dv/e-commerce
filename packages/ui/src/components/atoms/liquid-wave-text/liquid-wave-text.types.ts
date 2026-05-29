import { type ReactNode } from "react";

export interface ILiquidWaveTextProps {
  children: ReactNode;
  enableSelection?: boolean;
  isActive?: boolean;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}
