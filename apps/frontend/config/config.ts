import { ETheme } from "@/constants/theme.constanst";

export const THEMES = [
  { id: ETheme.BLUE, color: "#3b82f6", label: "Blue" },
  { id: ETheme.GREEN, color: "#22c55e", label: "Green" },
  { id: ETheme.ORANGE, color: "#f97316", label: "Orange" },
  { id: ETheme.GOLD, color: "#d97706", label: "Luxury Gold" },
] as const;

export type ThemeOption = (typeof THEMES)[number];

export const DEFAULT_THEME = ETheme.BLUE;
export const DEFAULT_DARK_MODE = false;
