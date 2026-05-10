import { ETheme } from '@/constants/theme.constanst';

export const THEMES = [
  { id: ETheme.BLUE, color: '#3b82f6', label: 'Blue' },
  { id: ETheme.RED, color: '#ef4444', label: 'Red' },
  { id: ETheme.GREEN, color: '#22c55e', label: 'Green' },
] as const;

export type ThemeOption = (typeof THEMES)[number];

export const DEFAULT_THEME = ETheme.BLUE;
export const DEFAULT_DARK_MODE = false;
