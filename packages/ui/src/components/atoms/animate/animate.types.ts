import { type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

export interface IAnimationContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
}

export interface IAnimationItemProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
}
