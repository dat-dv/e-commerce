import { ETheme } from "@ecommerce/ui/tokens";

export const EAdminTheme = ETheme;
export type EAdminTheme = ETheme;

export const VALID_THEMES = Object.values(ETheme) as string[];

/** localStorage key shared between the theme script and the Zustand store. */
export const ADMIN_THEME_KEY = "ADMIN_CONFIG";
