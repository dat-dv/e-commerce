type ResponsiveOnlyProps = {
  children: React.ReactNode;
  className?: string;
};

export function MobileOnly({ children, className }: ResponsiveOnlyProps) {
  return <div className={`block md:hidden ${className ?? ""}`}>{children}</div>;
}

export function DesktopOnly({ children, className }: ResponsiveOnlyProps) {
  return <div className={`hidden md:block ${className ?? ""}`}>{children}</div>;
}
