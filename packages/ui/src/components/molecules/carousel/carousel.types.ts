import { type EmblaOptionsType } from "embla-carousel";
import { type ReactNode } from "react";

export interface ICarouselProps {
  children: ReactNode;
  options?: EmblaOptionsType;
  loadMore?: () => void;
  threshold?: number;
  total?: number;
  current?: number;
}
