import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** @description Merge Tailwind classes safely without conflicts */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
