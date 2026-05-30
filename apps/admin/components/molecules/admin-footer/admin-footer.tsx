export const AdminFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-[var(--app-bg)]">
      <div className="mx-auto flex h-12 max-w-screen-2xl items-center justify-between px-4 sm:px-6">
        {/* Left: copyright */}
        <p className="text-xs text-[var(--muted)]">
          © {year}{" "}
          <span className="font-medium text-[var(--app-text)]">Chốt Đơn</span> —
          Admin Portal
        </p>

        {/* Right: version tag + status */}
        <div className="flex items-center gap-3">
          {/* System status indicator */}
          <div className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
            />
            <span className="text-xs text-[var(--muted)]">
              All systems operational
            </span>
          </div>

          {/* Version */}
          <span className="hidden rounded-md border border-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted)] sm:inline">
            v0.1.0
          </span>
        </div>
      </div>
    </footer>
  );
};

AdminFooter.displayName = "AdminFooter";
