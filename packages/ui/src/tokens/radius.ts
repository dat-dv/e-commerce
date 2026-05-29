export const UI_RADIUS = {
  control: "rounded-lg",
  input: "rounded-lg",
  card: "rounded-lg",
  panel: "rounded-xl",
  popover: "rounded-xl",
  modal: "rounded-2xl",
  drawer: "rounded-2xl",
  badge: "rounded-full",
  avatar: "rounded-full",
  media: "rounded-lg",
} as const;

export type UiRadiusKey = keyof typeof UI_RADIUS;
