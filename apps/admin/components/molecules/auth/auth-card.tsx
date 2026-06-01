import { type ReactNode } from "react";

interface IAuthCardProps {
  children: ReactNode;
}

export const AuthCard = ({ children }: IAuthCardProps) => (
  <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-8 shadow-2xl backdrop-blur-xl">
    {children}
  </div>
);

AuthCard.displayName = "AuthCard";
