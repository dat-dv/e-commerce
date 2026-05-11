import { z } from "zod";

import { ETheme } from "@/constants/theme.constanst";

export const themeConfigSchema = z.object({
  isDarkMode: z.boolean(),
  theme: z.enum(ETheme),
});

export type ThemeConfigSchema = z.infer<typeof themeConfigSchema>;
