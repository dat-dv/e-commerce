import { type ReactNode } from "react";

interface IAuthCardProps {
  children: ReactNode;
}

export const AuthCard = ({ children }: IAuthCardProps) => (
  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
    {children}
  </div>
);

AuthCard.displayName = "AuthCard";
