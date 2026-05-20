"use client";

import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { ArrowRight, User } from "lucide-react";
import { useTranslations } from "next-intl";

interface IUserProfileSectionProps {
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  onClose: () => void;
}

export default function UserProfileSection({
  user,
  onClose,
}: IUserProfileSectionProps) {
  const t = useTranslations("Common.header");

  return (
    <section className="mb-5">
      {user ? (
        <div className="flex items-center gap-3 rounded-xl border border-content/10 bg-content/[0.025] p-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-base font-black uppercase text-primary">
            {user.firstName ? user.firstName[0] : <User size={18} />}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-black text-content">
              {`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                t("avatarDropdown.fallbackUser")}
            </span>
            <span className="mt-0.5 truncate text-xs font-medium text-content/50">
              {user.email || t("avatarDropdown.noEmail")}
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-content/10 bg-content/[0.025] p-3">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-content">
                {t("avatarDropdown.accountDetails")}
              </p>
              <p className="mt-0.5 text-xs font-medium text-content/50">
                {t("signIn")} / {t("signUp")}
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            href={APP_ROUTES.SIGN_IN}
            onClick={onClose}
            className="h-10 w-full justify-between rounded-lg px-3 text-sm"
          >
            {t("signIn")}
            <ArrowRight size={16} />
          </Button>
          <Button
            variant="ghost"
            href={APP_ROUTES.SIGN_UP}
            onClick={onClose}
            className="mt-2 h-9 w-full justify-center rounded-lg border border-content/10 text-xs"
          >
            {t("signUp")}
          </Button>
        </div>
      )}
    </section>
  );
}
