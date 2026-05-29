"use client";

import React from "react";
import { Avatar } from "../../atoms/avatar";
import Button from "../../atoms/button";
import { Dropdown } from "../dropdown";
import { LogOut } from "lucide-react";
import { cn } from "../../../utils";
import { UI_RADIUS, TYPOGRAPHY } from "../../../tokens";

export interface AvatarDropdownMenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

export interface AvatarDropdownLabels {
  menuLabel?: string;
  fallbackUser?: string;
  noEmail?: string;
  signOut?: string;
}

export interface AvatarDropdownProps {
  name: string;
  email: string;
  avatarUrl?: string;
  menuItems: AvatarDropdownMenuItem[];
  labels?: AvatarDropdownLabels;
  onClickLogout: () => void;
  linkComponent?: React.ElementType;
  className?: string;
  popoverClassName?: string;
}

export const AvatarDropdown = ({
  name,
  email,
  avatarUrl,
  menuItems,
  labels,
  onClickLogout,
  linkComponent,
  className,
  popoverClassName,
}: AvatarDropdownProps) => {
  const menuLabel = labels?.menuLabel || "User Menu";
  const fallbackUser = labels?.fallbackUser || "User";
  const noEmail = labels?.noEmail || "No Email";
  const signOutLabel = labels?.signOut || "Sign Out";

  const displayName = name || fallbackUser;

  return (
    <Dropdown
      align="right"
      className={cn("flex", className)}
      popoverClassName={cn("min-w-0 w-64", popoverClassName)}
      trigger={({ ref, toggle, isOpen }) => (
        <Button
          ref={ref}
          onClick={toggle}
          aria-label={menuLabel}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className={cn(
            "group border-content/10 hover:border-content/5 relative h-10 w-10 cursor-pointer overflow-hidden border bg-transparent p-0 outline-none",
            UI_RADIUS.avatar,
          )}
        >
          <Avatar name={displayName} url={avatarUrl || ""} />
        </Button>
      )}
    >
      <div className="flex w-full flex-col">
        <div className="border-content/[0.08] bg-content/[0.01] flex items-center gap-2.5 border-b px-3 py-2.5">
          <div className="border-content/10 h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg border">
            <Avatar name={displayName} url={avatarUrl || ""} />
          </div>
          <div className="flex min-w-0 flex-col">
            <p
              className={`text-content truncate ${TYPOGRAPHY.bodySmall} leading-none font-semibold`}
            >
              {displayName}
            </p>
            <p
              className={`text-content/60 mt-1 truncate ${TYPOGRAPHY.meta} leading-none`}
            >
              {email || noEmail}
            </p>
          </div>
        </div>

        <div className="space-y-0.5 p-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                className="hover:bg-content/5 text-content group h-8 w-full justify-start rounded-lg px-2 font-medium transition-all"
                href={item.href}
                linkComponent={linkComponent}
              >
                <Icon
                  strokeWidth={1.5}
                  className="text-content/70 group-hover:text-content mr-2 h-4 w-4 transition-colors"
                />
                <span className={TYPOGRAPHY.caption}>{item.label}</span>
              </Button>
            );
          })}

          <div className="bg-content/[0.08] my-1 h-px" />

          <Button
            variant="danger"
            size="sm"
            onClick={onClickLogout}
            className="group h-8 w-full justify-start rounded-lg px-2 font-medium transition-all active:scale-95"
          >
            <LogOut
              strokeWidth={1.5}
              className="mr-2 h-4 w-4 text-white/90 transition-colors group-hover:text-white"
            />
            <span className={TYPOGRAPHY.caption}>{signOutLabel}</span>
          </Button>
        </div>
      </div>
    </Dropdown>
  );
};

export default AvatarDropdown;
