import { type ReactNode } from "react";

export interface IClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}
