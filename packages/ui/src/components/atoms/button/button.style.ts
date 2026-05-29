export const variantClasses = {
  primary:
    "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95",
  secondary:
    "bg-muted text-foreground border border-border hover:bg-muted/80 active:scale-95",
  outline:
    "border border-primary text-primary bg-transparent hover:bg-primary/10 active:scale-95",
  ghost:
    "bg-transparent text-foreground opacity-60 hover:opacity-100 hover:bg-primary/5",
  link: "bg-transparent text-primary underline underline-offset-2 hover:opacity-80 h-auto px-0",
  danger: "bg-transparent text-red-500 hover:bg-red-500/10 active:scale-95",
  "danger-solid":
    "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25 active:scale-95",
} as const;

export const sizeClasses = {
  sm: "h-7 px-2 text-[12px]",
  md: "h-9 px-4 text-[13px]",
  lg: "h-10 px-5 text-sm",
  icon: "size-9 p-0",
} as const;
