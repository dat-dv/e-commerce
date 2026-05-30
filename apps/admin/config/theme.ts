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
