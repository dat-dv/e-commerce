import { type HTMLMotionProps } from "framer-motion";

export interface IThemeSwatchProps extends HTMLMotionProps<"button"> {
  color: string;
  selected?: boolean;
}
