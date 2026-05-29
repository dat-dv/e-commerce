"use client";

import { Button } from "@ecommerce/ui";
import { TYPOGRAPHY } from "@/constants/typography";
import { cn } from "@/utils/cn";
import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

type TMobileDrawerActionTone = "default" | "primary" | "danger";

interface IMobileDrawerActionProps {
  icon: LucideIcon;
  label: ReactNode;
  href?: string;
  onClick?: () => void | Promise<void>;
  isActive?: boolean;
  badge?: ReactNode;
  tone?: TMobileDrawerActionTone;
  className?: string;
}

const getActionClassName = (
  isActive: boolean,
  tone: TMobileDrawerActionTone,
  className?: string,
) =>
  cn(
    "flex h-11 w-full items-center justify-start rounded-lg px-2 text-left text-sm font-bold transition-colors",
    tone === "danger"
      ? "text-red-500 hover:bg-red-500/5"
      : isActive
        ? "bg-primary/10 text-primary"
        : "text-content/70 hover:bg-content/[0.04] hover:text-content",
    className,
  );

const getIconClassName = (isActive: boolean, tone: TMobileDrawerActionTone) =>
  cn(
    "flex size-8 shrink-0 items-center justify-center rounded-md",
    tone === "danger"
      ? "bg-red-500/10"
      : isActive
        ? "bg-primary text-white"
        : "bg-content/[0.04]",
  );

export function MobileDrawerSectionTitle({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span
      className={`mb-2 px-1 ${TYPOGRAPHY.caption} text-content/35 font-black tracking-[0.18em] uppercase`}
    >
      {children}
    </span>
  );
}

export default function MobileDrawerAction({
  icon: Icon,
  label,
  href,
  onClick,
  isActive = false,
  badge,
  tone = "default",
  className,
}: IMobileDrawerActionProps) {
  const content = (
    <>
      <span className={getIconClassName(isActive, tone)}>
        <Icon size={16} />
      </span>
      <span className="ml-3 flex min-w-0 flex-1 items-center gap-2 truncate">
        {label}
        {badge}
      </span>
    </>
  );
  const actionClassName = getActionClassName(isActive, tone, className);

  if (href) {
    return (
      <Button
        variant="ghost"
        href={href}
        onClick={onClick}
        className={actionClassName}
      >
        {content}
      </Button>
    );
  }

  return (
    <Button variant="ghost" onClick={onClick} className={actionClassName}>
      {content}
    </Button>
  );
}
