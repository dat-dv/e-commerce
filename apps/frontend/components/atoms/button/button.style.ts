export const variantClasses = {
  primary:
    "bg-primary text-on-primary shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95",
  ghost: "bg-transparent text-content opacity-70 hover:opacity-100",
  danger: "bg-transparent text-red-500 hover:bg-red-500/10",
  outline:
    "border border-primary text-primary bg-transparent hover:bg-primary/10",
} as const;

export const sizeClasses = {
  sm: "h-7 px-2 text-[12px]",
  md: "h-9 px-4 text-[13px]",
  lg: "h-10 px-5 text-sm",
  icon: "size-10 p-0",
} as const;
