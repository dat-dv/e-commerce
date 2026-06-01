import { type ReactNode } from "react";

interface IAuthPageShellProps {
  variant?: "sign-in" | "forgot-password";
  children: ReactNode;
}

export const AuthPageShell = ({
  variant = "sign-in",
  children,
}: IAuthPageShellProps) => (
  <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] px-4">
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      {variant === "sign-in" ? (
        <>
          <div className="bg-primary/20 absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-[120px]" />
          <div className="bg-primary/10 absolute -right-40 -bottom-40 h-[500px] w-[500px] rounded-full blur-[120px]" />
        </>
      ) : (
        <>
          <div className="bg-primary/20 absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full blur-[120px]" />
          <div className="bg-primary/10 absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full blur-[120px]" />
        </>
      )}
    </div>

    <div className="relative w-full max-w-md">{children}</div>
  </div>
);

AuthPageShell.displayName = "AuthPageShell";
