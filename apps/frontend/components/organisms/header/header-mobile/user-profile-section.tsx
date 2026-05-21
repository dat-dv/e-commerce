"use client";

import Avatar from "@/components/atoms/avatar";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { TUser } from "@/domain/auth/types/auth.model";
import { LogIn, User, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { ComponentPropsWithoutRef } from "react";

interface IUserProfileSectionProps extends Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> {
  user: Partial<TUser> | null;
  onClose: () => void;
}

export default function UserProfileSection({
  user,
  onClose,
  ...rest
}: IUserProfileSectionProps) {
  const t = useTranslations("Common.header");

  return (
    <section {...rest}>
      {user ? (
        <Button
          variant="ghost"
          href={APP_ROUTES.PROFILE}
          onClick={onClose}
          className="hover:bg-content/[0.04] flex h-auto w-full items-center justify-start rounded-lg px-2 py-2 text-left"
        >
          <div className="border-content/10 size-11 overflow-hidden rounded-full border">
            <Avatar
              name={`${user.firstName || ""} ${user.lastName || ""}`.trim()}
              url={user?.avatarUrl || ""}
            />
          </div>
          <span className="ml-3 flex min-w-0 flex-1 flex-col">
            <span className="text-content truncate text-sm font-black">
              {`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                t("avatarDropdown.fallbackUser")}
            </span>
            <span className="text-content/50 mt-0.5 truncate text-xs font-medium">
              {user.email || t("avatarDropdown.noEmail")}
            </span>
          </span>
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3 px-1">
            <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
              <User size={17} />
            </span>
            <span className="min-w-0">
              <span className="text-content block text-sm font-black">
                {t("avatarDropdown.accountDetails")}
              </span>
              <span className="text-content/50 mt-0.5 block text-xs font-medium">
                {t("signIn")} {t("navigation").toLowerCase()}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="primary"
              href={APP_ROUTES.SIGN_IN}
              onClick={onClose}
              className="h-10 rounded-lg px-2 text-xs"
            >
              <LogIn size={15} />
              {t("signIn")}
            </Button>
            <Button
              variant="ghost"
              href={APP_ROUTES.SIGN_UP}
              onClick={onClose}
              className="border-content/10 h-10 rounded-lg border px-2 text-xs"
            >
              <UserPlus size={15} />
              {t("signUp")}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
