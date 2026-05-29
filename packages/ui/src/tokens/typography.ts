export const TYPOGRAPHY = {
  badge: "text-[10px] font-bold",
  caption: "text-xs",
  meta: "text-xs font-medium",
  label: "text-sm font-semibold",
  bodySmall: "text-sm leading-5",
  body: "text-sm leading-6 md:text-base",
  cardTitle: "text-sm font-bold md:text-base",
  sectionTitle: "text-xl font-black md:text-2xl",
  pageTitle: "text-3xl font-black md:text-5xl",
  heroTitle: "text-4xl font-black sm:text-5xl md:text-7xl",
} as const;

export type TypographyToken = keyof typeof TYPOGRAPHY;
