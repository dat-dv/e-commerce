/** Available colour themes for the admin dashboard. */
export enum EAdminTheme {
  INDIGO = "indigo",
  BLUE = "blue",
  GREEN = "green",
  ORANGE = "orange",
  GOLD = "gold",
}

export const VALID_THEMES = Object.values(EAdminTheme) as string[];

/** localStorage key shared between the theme script and the Zustand store. */
export const ADMIN_THEME_KEY = "ADMIN_CONFIG";

/** Background colours used by the theme-color meta tag. */
export const DARK_BG: Record<EAdminTheme, string> = {
  [EAdminTheme.INDIGO]: "#0f1117",
  [EAdminTheme.BLUE]: "#020617",
  [EAdminTheme.GREEN]: "#060c09",
  [EAdminTheme.ORANGE]: "#0c0a09",
  [EAdminTheme.GOLD]: "#1c1917",
};

export const LIGHT_BG: Record<EAdminTheme, string> = {
  [EAdminTheme.INDIGO]: "#f8f9fc",
  [EAdminTheme.BLUE]: "#f8faff",
  [EAdminTheme.GREEN]: "#f0fdf4",
  [EAdminTheme.ORANGE]: "#fff7ed",
  [EAdminTheme.GOLD]: "#fffbeb",
};
