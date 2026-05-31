"use client";

import { LogOut } from "lucide-react";
import React from "react";

import { TYPOGRAPHY, UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import { Avatar } from "../../atoms/avatar";
import { Button } from "../../atoms/button";
import { Dropdown } from "../dropdown";
import { IAvatarDropdownProps } from "./avatar-dropdown.types";

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
}: IAvatarDropdownProps) => {
  const menuLabel = labels?.menuLabel || "User Menu";
  const fallbackUser = labels?.fallbackUser || "User";
  const noEmail = labels?.noEmail || "No Email";
  const signOutLabel = labels?.signOut || "Sign Out";

  const displayName = name || fallbackUser;

  return (
    <Dropdown
      align="right"
      className={cn("flex", className)}
      popoverClassName={cn(
        "w-60 min-w-0 border-content/10 bg-surface/88 p-0 shadow-[0_16px_36px_rgba(0,0,0,0.12)] backdrop-blur-2xl",
        popoverClassName,
      )}
      trigger={({ ref, toggle, isOpen }) => (
        <Button
          ref={ref}
          onClick={toggle}
          aria-label={menuLabel}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className={cn(
            "group border-content/10 relative h-10 w-10 cursor-pointer overflow-hidden border bg-transparent p-0 shadow-none outline-none",
            UI_RADIUS.avatar,
          )}
        >
          <Avatar name={displayName} url={avatarUrl || ""} />
        </Button>
      )}
    >
      {({ close }) => {
        return (
          <div className="flex w-full flex-col">
            <div className="border-content/[0.08] flex items-center gap-2.5 border-b px-2.5 py-2.5">
              <div className="border-surface h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border-2 shadow-sm">
                <Avatar name={displayName} url={avatarUrl || ""} />
              </div>
              <div className="flex min-w-0 flex-col">
                <p
                  className={`text-content truncate ${TYPOGRAPHY.bodySmall} leading-none font-bold`}
                >
                  {displayName}
                </p>
                <p
                  className={`text-content/50 mt-1 truncate text-[11px] leading-none font-medium`}
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
                    className={cn(
                      "group h-[34px] w-full justify-start gap-2 rounded-lg px-1.5 font-semibold opacity-100 transition-colors",
                      item.active
                        ? "bg-primary/[0.09] text-primary hover:bg-primary/[0.12] hover:text-primary"
                        : "text-content/65 hover:bg-content/[0.055] hover:text-content",
                    )}
                    href={item.href}
                    linkComponent={linkComponent}
                    onClick={close}
                  >
                    <Icon
                      strokeWidth={1.65}
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        item.active
                          ? "text-primary"
                          : "text-content/45 group-hover:text-content",
                      )}
                    />
                    <span className={`${TYPOGRAPHY.caption} truncate`}>
                      {item.label}
                    </span>
                  </Button>
                );
              })}

              <div className="bg-content/[0.08] my-1 h-px" />

              <Button
                variant="ghost"
                size="sm"
                onClick={onClickLogout}
                className="group h-[34px] w-full justify-start gap-2 rounded-lg px-1.5 font-semibold text-red-500 opacity-100 transition-colors hover:bg-red-500/10 hover:text-red-600 active:scale-[0.98]"
              >
                <LogOut
                  strokeWidth={1.65}
                  className="size-4 shrink-0 text-red-400 transition-colors group-hover:text-red-600"
                />
                <span className={`${TYPOGRAPHY.caption} truncate`}>
                  {signOutLabel}
                </span>
              </Button>
            </div>
          </div>
        );
      }}
    </Dropdown>
  );
};

AvatarDropdown.displayName = "AvatarDropdown";
